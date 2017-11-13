<?php
  function get_db() {
    $server = '127.0.0.2';
    $user = 'admin';
    $pass = 'pass';
    $db = 'todoapp';

    $mysqli = new mysqli($server, $user, $pass, $db);
    if ($mysqli->connect_error) {
      die('Connection failed: '.$mysqli->connect_error);
    } else {
      $mysqli->set_charset('utf8');
      return $mysqli;
    }
  }
?>