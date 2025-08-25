<?php
namespace App;

use App\Database;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\SocketClient;

require_once __DIR__ . '/Database.php';

class ApiController
{
	public static function register(array $data)
	{
		$db = Database::getConnection();
		$stmt = $db->prepare('INSERT INTO users (username, password_hash, email, created_at) VALUES (?, ?, ?, NOW())');
		$pwHash = password_hash($data['password'], PASSWORD_DEFAULT);
		$stmt->execute([$data['username'], $pwHash, $data['email'] ?? null]);
		return ['status' => 'ok', 'id' => $db->lastInsertId()];
	}

	public static function login(array $data)
	{
		$db = Database::getConnection();
		$stmt = $db->prepare('SELECT id, username, password_hash, is_admin FROM users WHERE username = ? LIMIT 1');
		$stmt->execute([$data['username']]);
		$user = $stmt->fetch();
		if (!$user) return ['error' => 'invalid_credentials'];
		if (!password_verify($data['password'], $user['password_hash'])) return ['error' => 'invalid_credentials'];

		$payload = [
			'sub' => $user['id'],
			'username' => $user['username'],
			'admin' => (bool)$user['is_admin'],
			'iat' => time(),
			'exp' => time() + 60 * 60 * 24, // 24h
		];
		$secret = env_val('JWT_SECRET', 'change-me');
		$token = JWT::encode($payload, $secret, 'HS256');
		return ['token' => $token, 'user' => ['id' => $user['id'], 'username' => $user['username']]];
	}

	public static function requireAdmin(array $jwtPayload)
	{
		if (empty($jwtPayload['admin'])) {
			http_response_code(403);
			echo json_encode(['error' => 'forbidden']);
			exit;
		}
	}

	// Helper to notify socket server about an event
	public static function notifySocket(array $payload, ?string $room = null)
	{
		$socketUrl = env_val('SOCKET_SERVER_URL');
		if (!$socketUrl) return false;
		return SocketClient::broadcast($socketUrl, $payload, $room);
	}
}

