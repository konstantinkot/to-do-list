<?php

$text = $_POST["text"];
$items = $_POST["items"];

// открываем файл, если файл не существует,
//делается попытка создать его
array_push($items, [$text]);

$fp = fopen("todo-items.json", "w"); 
// записываем в файл текст
fwrite($fp, $items);
 
// закрываем
fclose($fp);
?>