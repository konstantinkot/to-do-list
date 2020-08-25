<?php

$items = $_POST["items"];

$fp = fopen("todo-items.json", "w");
 
// записываем в файл текст
fwrite($fp, $items);
 
// закрываем
fclose($fp);
?>