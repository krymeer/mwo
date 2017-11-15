<?php

	session_start();
	session_unset();
	session_destroy();

  setcookie("user_logged_out", "1");

	header( "Location: ./index.php" );
	exit;

?>