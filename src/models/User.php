<?php
namespace App\Models;

class User
{
	public int $id;
	public string $username;
	public bool $is_admin;

	public function __construct(array $row)
	{
		$this->id = (int)$row['id'];
		$this->username = $row['username'];
		$this->is_admin = !empty($row['is_admin']);
	}
}

