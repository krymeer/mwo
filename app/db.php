<?php

	function get_db() {

		$server = "s24.zbpma.pl";
		$user = "kovalson_todoapp";
		$pass = "todoapp";
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