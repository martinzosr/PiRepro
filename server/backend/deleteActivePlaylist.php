<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$tokken = getTokkenFromHeader(apache_request_headers());
$res = $db->deleteActivePlaylist($tokken);
if ($res) {
} else {
	http_response_code1(500);
}
$db->stopConnection();
?>
