<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');
ini_set('display_startup_errors', 'on');
include 'functions.php';

class Backdoor {

    private $con;

    public function startConnection() {
        $this->con = mysqli_connect("localhost", "pirepro", "TotoHesloProsimNehackovat", "pirepro") or die("Error " . mysqli_error($con));
        $this->con->set_charset("utf8");
    }

    public function stopConnection() {
        $this->con->close();
    }

    public function test(){
        echo "TEST";
    }

    private function userAlreadyExists($username) {
        $cleanUsername = $this->sanitize($username);
        $sql = "SELECT `US_Username` FROM `US_User` WHERE `US_Username`='" . $cleanUsername . "'";
        $res = $this->con->query($sql);
        if (($res != NULL) && ($res->num_rows > 0)) {
            return TRUE;
        }
        return FALSE;
    }

    //prida noveho uzivatela do tabulky ... ak sa mu to podari tak vrati TRUE ak sa mu to nepodari tak vrati FALSE
    private function addNewUser($username, $password) {
        $cleanEmail = $this->sanitize($username);
        $cleanPassword = sha1($password);
        $sql = "INSERT INTO `pirepro`.`US_User` (`US_Username`, `US_Tokken`, `US_Password`, `US_Created`) VALUES ('$username', NULL, '$password', NOW());";
	echo $sql;
        if ($this->con->query($sql)) {
		return TRUE;
        }
        return FALSE;
    }

    public function newUser($username, $password) {
        if ($this->userAlreadyExists($username) === TRUE) {
            //taky ucet uz existuje
            return -2;
        }
        if ($this->addNewUser($username, $password) === TRUE) {
            return 1;
        } else {
            //nepodarilo sa ...
            return 0;
        }
    }

    public function login($username, $password) {
        if (!$this->userAlreadyExists($username)) {
            return Array(4);
        }
        $sql = "SELECT * FROM `US_User` WHERE `US_Username` = '$username';";
        $res = $this->con->query($sql);
        $user = $res->fetch_row();
            if ($user[3] != sha1($password)) {
                return Array(2);
            } else {
                if ($user[2]) {
                    return Array(1, $user[2]);
                } else {
                    $tokken = randStr(20);
                    $sql2 = "UPDATE `US_User` SET `US_Tokken` = '$tokken' WHERE `US_User`.`US_Id` = $user[0];";
                    if ($this->con->query($sql2) === TRUE) {
                        return $tokken;
                    } else {
                        echo "ERROR: " . $this->con->error;
                        return Array(0);
                    }
                }
            }
    }

	public function getSong($songId){
	$sql = "SELECT * FROM `PL_Song` WHERE `SongID` = '$songId';";
        $res = $this->con->query($sql);
        $song = $res->fetch_assoc();
		return $song;
	}
		

    public function getIdFromTokken($tokken) {
        $sql = "SELECT * FROM `US_User` WHERE `US_Tokken` = '$tokken';";
        $res = $this->con->query($sql);
        $user = $res->fetch_assoc();
        return $user['US_Id'];
    }

	public function unactivePlaylists($tokken) {
		$userId = $this->getIdFromTokken($tokken);
		$sql = "UPDATE `US_Playlist` SET `PL_Actual`='0' WHERE `PL_Owner`='$userId';";
		if ($this->con->query($sql)) {
			return True;
		} else {
			return False;
		}
	}

	public function setActivePlaylist($tokken, $id) {
		$userId = $this->getIdFromTokken($tokken);
		if ($this->unactivePlaylists($tokken)) {
			$sql2 = "UPDATE `US_Playlist` SET `PL_Actual`='1' WHERE `PL_Id`='$id' AND `PL_Owner`='$userId';";
			if ($this->con->query($sql2)) {
				return True;
			} else {
				return False;
			}
		} else {
			return False;
		}
	}

	public function setActivePlaylist1($tokken, $id) {
		$userId = $this->getIdFromTokken($tokken);
		if ($this->unactivePlaylists($tokken)) {
			$sql2 = "UPDATE `US_Playlist` SET `PL_Actual`='1' WHERE `PL_Id`='$id' AND `PL_Owner`='$userId';";
			if ($this->con->query($sql2)) {
				return True;
			} else {
				return False;
			}
		} else {
			return False;
		}
	}

	public function addPlaylist($tokken, $name) {
		$userId = $this->getIdFromTokken($tokken);
		if ($this->unactivePlaylists($tokken)) {
			$sql2 = "INSERT INTO `pirepro`.`US_Playlist` (`PL_Id`, `PL_Name`, `PL_Owner`, `PL_Created`, `PL_Actual`, `PL_Deleted`) VALUES (NULL, '$name', '$userId', NOW(), '1', '0');";
			if ($this->con->query($sql2)) {
				return True;
			} else {
				return False;
			}
		} else {
			return False;
		}
	}

	public function getPlaylistInfo($id) {
        $sql = "SELECT so.`SO_Id`,so.`SO_Name`,so.`SO_Duration` FROM `US_PlaylistSongRelation` AS psr INNER JOIN `PL_Song` AS so ON psr.`PSR_Song` = so.`SO_Id` WHERE psr.`PSR_Playlist` = '$id' ORDER BY psr.`PSR_Priority`;";
        $res = $this->con->query($sql);
		$playlists = array();
		while ($row = $res->fetch_assoc()) {
		  $playlists[] = $row;
		}
		return $playlists;	
		
	}

	public function getPlaylists($tokken) {
		$user = $this->getIdFromTokken($tokken);
        $sql = "SELECT `PL_Id`,`PL_Name`,`PL_Actual` FROM `US_Playlist` WHERE `PL_Owner` = '$user' AND `PL_Deleted` = '0'";
        $res = $this->con->query($sql);
		$playlists = array();
		while ($row = $res->fetch_assoc()) {
		  $playlists[] = $row;
		}
		return $playlists;	
		
	}

	public function getSongs($column, $order) {
		$columns = Array('SO_Id','SO_Name','SO_TrackNumber','SO_Duration','AR_Name','AL_Name','AL_DiscNumber','AL_Year','GE_Name');
		if(!in_array($column,$columns)){
			$column = "SO_Name";
		}
		if($order != "ASC" && $order != "DESC"){
			$order = "ASC";
		}
        $sql = "SELECT so.`SO_Id`,so.`SO_Name`,so.`SO_TrackNumber`,so.`SO_Duration`,ar.AR_Name,al.AL_Name,al.AL_DiscNumber,al.AL_Year,ge.GE_Name FROM `PL_Song` AS so LEFT OUTER JOIN PL_Artist AS ar ON so.`SO_Artist` = ar.`AR_Id` LEFT OUTER JOIN PL_Album AS al ON so.`SO_Album` = al.`AL_Id` LEFT OUTER JOIN PL_GenderList as ge ON al.`AL_Gender` = ge.`GE_Id` ORDER BY $column $order;";
        $res = $this->con->query($sql);
		$songs = array();
		while ($row = $res->fetch_assoc()) {
		  $songs[] = $row;
		}
		return $songs;	
		
	}
	
	
	public function isOwnerPlaylist($tokken, $id) {
		$userId = $this->getIdFromTokken($tokken);
		$sql = "SELECT `PL_Owner` FROM `US_Playlist` WHERE `PL_Id` = '$id'";
		if ($this->con->query($sql)) {
			return True;
			$user = $res->fetch_assoc();
			return $user['PL_Owner'] == $userId;
		} else {
			return False;
		}
	}

	public function addSongToPlaylist($tokken, $playlistId, $songId) {
		$userId = $this->getIdFromTokken($tokken);
		$sql = "SET @newprior = (SELECT max(`PSR_Priority`) + 10 FROM US_PlaylistSongRelation WHERE `PSR_Playlist` = '$playlistId'); INSERT INTO `pirepro`.`US_PlaylistSongRelation` (`PSR_Id`, `PSR_Playlist`, `PSR_Song`, `PSR_Priority`) VALUES (NULL, '$playlistId', '$songId', @newprior); ";
		if (isOwnerPlaylist($tokken, $id) && $this->con->query($sql)) {
			return True;
		} else {
			return False;
		}
	}


    public function sanitize($input) {
        if (is_array($input)) {
            foreach ($input as $var => $val) {
                $output[$var] = sanitize($val);
            }
        } else {
            if (get_magic_quotes_gpc()) {
                $input = stripslashes($input);
            }
            $input = cleanInput($input);
            $output = mysqli_real_escape_string($this->con, $input);
        }
        return $output;
    }


}
