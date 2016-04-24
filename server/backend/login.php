<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$post = file_get_contents('php://input');
$post = json_decode($post, true);

if(array_key_exists('username', $post) && array_key_exists('password', $post)){
	$res = $db->login($post['username'], $post['password']);
	if($res[0] == 1){
		//poslanie tokkenu
		echo "{\"tokken\":\"".$res[1]."\"}";
	} else if($res[0] == 2){
		//zle heslo
		http_response_code(403);
	} else if($res[0] == 4){
		//neexistuje uzivatel
		http_response_code(404);
	} else if($res[0] == 0){
		//internal server error
		http_response_code(500);
	}
}

$db->stopConnection();
?>
