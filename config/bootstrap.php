<?php
// Project bootstrap: autoload and load .env when present.
// This file is intentionally safe to include on production even if .env is not present.

// Load Composer autoloader
$autoload = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoload)) {
	require_once $autoload;
}

// Load environment variables from .env if present (vlucas/phpdotenv)
if (class_exists(\Dotenv\Dotenv::class)) {
	try {
		$dotEnvPath = dirname(__DIR__);
		if (file_exists($dotEnvPath . '/.env')) {
			$dotenv = Dotenv\Dotenv::createImmutable($dotEnvPath);
			$dotenv->safeLoad(); // don't throw if missing required vars
		}
	} catch (Throwable $e) {
		// silent fallback: env vars may be provided by server
	}
}

// Helper to get env values with optional default
if (!function_exists('env_val')) {
	function env_val(string $key, $default = null)
	{
		$v = getenv($key);
		if ($v === false) {
			if (isset($_ENV[$key])) return $_ENV[$key];
			if (isset($_SERVER[$key])) return $_SERVER[$key];
			return $default;
		}
		return $v;
	}
}

