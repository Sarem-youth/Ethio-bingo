<?php
namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/Database.php';

class Auth
{
	public static function getBearerTokenPayload()
	{
		$headers = getallheaders();
		$auth = $headers['Authorization'] ?? $headers['authorization'] ?? null;
		if (!$auth) return null;
		if (!preg_match('/^Bearer\s+(.*)$/i', $auth, $m)) return null;
		$token = $m[1];
		$secret = env_val('JWT_SECRET', 'change-me');
		try {
			$payload = (array) JWT::decode($token, new Key($secret, 'HS256'));
			return $payload;
		} catch (\Throwable $e) {
			return null;
		}
	}
}

