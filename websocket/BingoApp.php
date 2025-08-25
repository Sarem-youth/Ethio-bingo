<?php
namespace App\Websocket;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class BingoApp implements MessageComponentInterface
{
	protected array $clients = [];

	public function onOpen(ConnectionInterface $conn)
	{
		$this->clients[$conn->resourceId] = $conn;
		// send a welcome message
		$conn->send(json_encode(['type' => 'welcome', 'id' => $conn->resourceId]));
	}

	public function onMessage(ConnectionInterface $from, $msg)
	{
		$payload = json_decode($msg, true);
		if (!is_array($payload)) return;

		// simple echo/broadcast logic depending on type
		if (isset($payload['type']) && $payload['type'] === 'broadcast') {
			$this->broadcast($payload['data'], $from->resourceId);
		}
	}

	public function onClose(ConnectionInterface $conn)
	{
		unset($this->clients[$conn->resourceId]);
	}

	public function onError(ConnectionInterface $conn, \Exception $e)
	{
		$conn->close();
	}

	protected function broadcast($data, $excludeId = null)
	{
		$msg = json_encode(['type' => 'broadcast', 'data' => $data]);
		foreach ($this->clients as $id => $client) {
			if ($id === $excludeId) continue;
			$client->send($msg);
		}
	}
}

