<?php

$url = "https://pahoda.capsulecrm.com/api/users";
$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
	curl_setopt($ch, CURLOPT_USERPWD, "108fa7bce4476acba87cd36f699b2df9:x");
	$cc = curl_exec($ch);
if( $cc === false)
{
    echo 'Ошибка curl: ' . curl_error($ch);
}
else
{
    echo 'Операция завершена без каких-либо ошибок<br>';
	var_dump($cc);
}

	$info = curl_getinfo($ch);
	
curl_close($ch);

	
?>