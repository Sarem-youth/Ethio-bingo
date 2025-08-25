<?php
// Simple redirect to the built frontend in /public
// Place this file at the project root so requests to the domain root are redirected
header('Location: /public/', true, 302);
exit;
