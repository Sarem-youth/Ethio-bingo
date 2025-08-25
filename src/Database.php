<?php
namespace App;

use PDO;
use PDOException;

require_once __DIR__ . '/../config/bootstrap.php';

class Database
{
	private static ?PDO $instance = null;

	public static function getConnection(): PDO
	{
		if (self::$instance !== null) {
			return self::$instance;
		}

		$host = env_val('DB_HOST');
		$db = env_val('DB_NAME');
		$user = env_val('DB_USER');
		$pass = env_val('DB_PASS');
		if (empty($host) || empty($db) || empty($user) || $pass === null) {
			throw new \RuntimeException("Database credentials are missing. Please set DB_HOST, DB_NAME, DB_USER and DB_PASS in environment variables (or .env).");
		}
		$charset = 'utf8mb4';

		$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
		$options = [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES => false,
		];

		try {
			self::$instance = new PDO($dsn, $user, $pass, $options);
			return self::$instance;
		} catch (PDOException $e) {
			// For production, do not echo credentials or detailed errors
			throw new \RuntimeException('Database connection failed: ' . $e->getMessage());
		}
	}
}

