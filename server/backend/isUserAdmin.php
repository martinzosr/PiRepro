<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$tokken = getTokkenFromHeader(apache_request_headers());
$res = $db->isUserAdmin($tokken);
if ($res) {
	http_response_code1(200);
} else {
	http_response_code1(405);
}

$db->stopConnection();
?>

