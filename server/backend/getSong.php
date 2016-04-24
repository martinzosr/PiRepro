<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

if (isset($_GET['songId'])){
    $res = $db->getSong($_GET['songId']);
	if ($res == NULL) {
	    http_response_code1(404);
	} else {
	    http_response_code1(200);
		echo json_encode($res);
	}
} else {
    http_response_code1(404);
}

$db->stopConnection();
?>
