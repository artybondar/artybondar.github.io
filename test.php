<?php
function findWord($number){
	$find = '����';
	$pos = strpos($number, $find); 
	return (bool)$pos;
}

 $string = '�� ���������� �����';
 var_dump(findWord($string));
?>