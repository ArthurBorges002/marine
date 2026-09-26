<?php
// Definir as variáveis de conexão
$host = "127.0.0.1";
$user = "root";    
$dbname = "marine";  
$password = "";

// Criar a conexão
$conexao = new mysqli($host, $user, $password, $dbname);

// Verificar se houve erro na conexão
if ($conexao->connect_error) {
    die("Erro na conexao: " . $conn->connect_error);
}
?>
