<?php
namespace App;

use Firebase\JWT\JWT;

class SocketClient
{
    public static function broadcast(string $socketUrl, array $payload, ?string $room = null): bool
    {
        $secret = env_val('JWT_SECRET');
        if (!$secret) return false;

        $token = JWT::encode(['iss' => 'api', 'iat' => time()], $secret, 'HS256');

        $body = ['data' => $payload];
        if ($room) $body['room'] = $room;

        $ch = curl_init(rtrim($socketUrl, '/') . '/broadcast');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        $resp = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $code >= 200 && $code < 300;
    }
}
