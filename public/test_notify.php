<?php
// Quick CLI/script helper to start a game and draw a few numbers via the API
if (PHP_SAPI !== 'cli') {
    echo "This script is intended to be run from command line.\n";
}

$base = rtrim((getenv('APP_BASE_URL') ?: 'http://localhost'), '/');

// Start game
$start = json_decode(shell_exec('curl -s -X POST "' . $base . '/api.php?action=start" -H "Content-Type: application/json" -d "{\"stake_level_id\":1}"'), true);
print_r(["start_response" => $start]);
if (isset($start['game_id'])) {
    $gameId = (int)$start['game_id'];
    // call a few numbers
    for ($i=0;$i<5;$i++) {
    $r = json_decode(shell_exec('curl -s -X POST "' . $base . '/api.php?action=call" -H "Content-Type: application/json" -d "{\"game_id\":' . $gameId . '}"'), true);
        print_r(["call_response" => $r]);
        sleep(1);
    }
}
