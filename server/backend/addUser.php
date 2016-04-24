<?php

include("backdoor.php");

$db = new Backdoor;
$db->startConnection();


$post = file_get_contents('php://input');
$post = json_decode($post, true);

if (array_key_exists('username', $post) && array_key_exists('password', $post)) {
    $res = $db->newUser($post['username'], $post['password']);
    switch ($res) {
        case 1: //success
            http_response_code(201);
            break;
        case -2://already exists
            http_response_code(409);
            break;
        case 0://chyba pri zapise do databazy
            http_response_code(500);
            break;
    }
} else {
    http_response_code(406);
}
$db->stopConnection();
?>
