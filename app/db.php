<?php

	function get_db() {

		$server = "localhost";
		$user = "root";
		$pass = "";
		$db = "todoapp";

		$mysqli = new mysqli($server, $user, $pass, $db);

		if( $mysqli->connect_error ) {
			die( "Connection failed: ". $mysqli->connect_error );
		} else {
			$mysqli->set_charset( "utf8" );
			return $mysqli;
		}

	}

?>