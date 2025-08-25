<?php
namespace App;

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/SocketClient.php';

use PDO;

class GameEngine
{
    protected PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function startGame(int $stakeLevelId): array
    {
        $stmt = $this->db->prepare('INSERT INTO games (stake_level_id, start_time, status, called_numbers, created_at) VALUES (?, NOW(), ?, ?, NOW())');
        $stmt->execute([$stakeLevelId, 'running', json_encode([])]);
        $gameId = (int)$this->db->lastInsertId();

        $this->broadcast('game_started', ['game_id' => $gameId, 'stake_level_id' => $stakeLevelId]);

        return ['game_id' => $gameId];
    }

    public function callNumber(int $gameId): array
    {
        // load game
        $stmt = $this->db->prepare('SELECT called_numbers, status FROM games WHERE id = ? LIMIT 1');
        $stmt->execute([$gameId]);
        $game = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$game) return ['error' => 'game_not_found'];
        if ($game['status'] === 'finished') return ['error' => 'game_finished'];

        $called = json_decode($game['called_numbers'] ?? '[]', true) ?: [];

        // all numbers 1..75
        $all = range(1, 75);
        $remaining = array_values(array_diff($all, $called));
        if (empty($remaining)) {
            // no numbers left
            return ['error' => 'no_numbers_left'];
        }

        // pick random
        $num = $remaining[array_rand($remaining)];
        $called[] = $num;

        // update DB
        $upd = $this->db->prepare('UPDATE games SET called_numbers = ?, updated_at = NOW() WHERE id = ?');
        $upd->execute([json_encode($called), $gameId]);

        // broadcast
        $this->broadcast('number_called', ['game_id' => $gameId, 'number' => $num, 'called_numbers' => $called]);

        // check winners
        $winner = $this->findWinner($gameId, $called);
        if ($winner) {
            // mark game finished
            $finish = $this->db->prepare('UPDATE games SET status = ?, end_time = NOW(), winner_user_id = ?, winning_card_id = ? WHERE id = ?');
            $finish->execute(['finished', $winner['user_id'], $winner['card_id'], $gameId]);
            $this->broadcast('game_finished', ['game_id' => $gameId, 'winner' => $winner]);
            return ['number' => $num, 'winner' => $winner];
        }

        return ['number' => $num];
    }

    protected function findWinner(int $gameId, array $calledNumbers): ?array
    {
        // find purchased cards for this game
        $stmt = $this->db->prepare('SELECT pc.id as purchase_id, pc.user_id, pc.card_id, u.username FROM purchased_cards pc JOIN users u ON pc.user_id = u.id WHERE pc.game_id = ?');
        $stmt->execute([$gameId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $r) {
            // fetch card data
            $cstmt = $this->db->prepare('SELECT card_data FROM bingo_cards WHERE id = ? LIMIT 1');
            $cstmt->execute([$r['card_id']]);
            $card = $cstmt->fetch(PDO::FETCH_ASSOC);
            if (!$card) continue;
            $cardData = json_decode($card['card_data'], true);
            if ($this->isWinningCard($cardData, $calledNumbers)) {
                return ['user_id' => (int)$r['user_id'], 'card_id' => (int)$r['card_id'], 'username' => $r['username']];
            }
        }
        return null;
    }

    protected function isWinningCard(array $cardData, array $calledNumbers): bool
    {
        // Transform cardData (columns B,I,N,G,O arrays) into 5x5 grid (N center may be 0 or null)
        $grid = [];
        $cols = ['B','I','N','G','O'];
        for ($c = 0; $c < 5; $c++) {
            $col = $cols[$c];
            $values = $cardData[$col] ?? [];
            for ($r = 0; $r < 5; $r++) {
                $grid[$r][$c] = $values[$r] ?? null;
            }
        }

        // helper: marked if number in calledNumbers or it's the free center (0 or null)
        $marked = array_fill(0,5, array_fill(0,5,false));
        for ($r = 0; $r < 5; $r++) {
            for ($c = 0; $c < 5; $c++) {
                $val = $grid[$r][$c];
                if ($val === 0 || $val === null) {
                    $marked[$r][$c] = true;
                } elseif (in_array((int)$val, $calledNumbers, true)) {
                    $marked[$r][$c] = true;
                }
            }
        }

        // check rows
        for ($r = 0; $r < 5; $r++) {
            $ok = true;
            for ($c = 0; $c < 5; $c++) {
                if (!$marked[$r][$c]) { $ok = false; break; }
            }
            if ($ok) return true;
        }

        // check cols
        for ($c = 0; $c < 5; $c++) {
            $ok = true;
            for ($r = 0; $r < 5; $r++) {
                if (!$marked[$r][$c]) { $ok = false; break; }
            }
            if ($ok) return true;
        }

        // diagonals
        $ok = true; for ($i=0;$i<5;$i++) if (!$marked[$i][$i]) { $ok=false; break; } if ($ok) return true;
        $ok = true; for ($i=0;$i<5;$i++) if (!$marked[$i][4-$i]) { $ok=false; break; } if ($ok) return true;

        return false;
    }

    protected function broadcast(string $event, array $data)
    {
        $socketUrl = env_val('SOCKET_SERVER_URL');
        if (!$socketUrl) return false;
        // broadcast globally
        return SocketClient::broadcast($socketUrl, ['event'=>$event,'payload'=>$data]);
    }
}
