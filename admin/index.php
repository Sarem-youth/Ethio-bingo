<?php
require_once __DIR__ . '/../config/bootstrap.php';
// This admin panel expects server-side environment variables to be set for admin creds.
$adminUser = env_val('ADMIN_USER', null);
$adminPass = env_val('ADMIN_PASS', null);

// Simple login form that posts to the same page; in production use HTTPS and stronger flows.
session_start();
if (isset($_POST['username']) && isset($_POST['password'])) {
	// Compare with env-provided admin creds
	if ($adminUser && hash_equals($adminUser, $_POST['username']) && $adminPass && hash_equals($adminPass, $_POST['password'])) {
		$_SESSION['admin'] = true;
	} else {
		$error = 'Invalid credentials';
	}
}

if (!empty($_GET['logout'])) {
	session_destroy();
	header('Location: index.php');
	exit;
}

if (empty($_SESSION['admin'])) {
	?>
	<!doctype html>
	<html>
	<head><meta charset="utf-8"><title>Admin Login</title></head>
	<body>
	<h1>Admin Login</h1>
	<?php if (!empty($error)) echo '<p style="color:red">'.htmlspecialchars($error).'</p>'; ?>
	<form method="post">
		<label>Username: <input name="username"></label><br>
		<label>Password: <input name="password" type="password"></label><br>
		<button type="submit">Login</button>
	</form>
	</body>
	</html>
	<?php
	exit;
}

// Admin area: show links to features
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Admin Panel</title></head>
<body>
<h1>Admin Panel</h1>
<p><a href="?logout=1">Logout</a></p>
<ul>
	<li><a href="users.php">Manage Users</a> (not implemented in this MVP)</li>
	<li><a href="stakes.php">Stakes & Prizes</a></li>
	<li><a href="transactions.php">Transactions</a></li>
	<li><a href="index.php">Dashboard</a></li>
</ul>
<p>Server environment detected: <?php echo php_uname('s') . ' ' . php_uname('r'); ?></p>
</body>
</html>

