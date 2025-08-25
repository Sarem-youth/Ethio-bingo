<?php
// Minimal game API: POST /api.php?action=start or action=call
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../src/GameEngine.php';

use App\GameEngine;

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

$engine = new GameEngine();

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'only_post']);
    exit;
}

switch ($action) {
    case 'start':
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $stake = isset($input['stake_level_id']) ? (int)$input['stake_level_id'] : 1;
        $res = $engine->startGame($stake);
        echo json_encode($res);
        break;
    case 'call':
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $gameId = isset($input['game_id']) ? (int)$input['game_id'] : 0;
        if (!$gameId) { http_response_code(400); echo json_encode(['error'=>'missing_game_id']); exit; }
        $res = $engine->callNumber($gameId);
        echo json_encode($res);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'unknown_action']);
        break;
}
