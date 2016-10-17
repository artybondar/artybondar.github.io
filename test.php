<?php
function findWord($number){
	$find = 'Пулк';
	$pos = strpos($number, $find); 
	return (bool)$pos;
}

 $string = 'на Пулковском шоссе';
 var_dump(findWord($string));
?>