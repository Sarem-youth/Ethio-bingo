<?php
// Simple Ratchet WebSocket server runner. Run with: php websocket/server.php
require_once __DIR__ . '/../config/bootstrap.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use App\Websocket\BingoApp;

$port = (int) (env_val('WS_PORT', 8080));

$app = new BingoApp();
$server = IoServer::factory(new HttpServer(new WsServer($app)), $port);

echo "Starting WebSocket server on port {$port}\n";
$server->run();

