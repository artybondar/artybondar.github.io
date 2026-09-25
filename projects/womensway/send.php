<?php
header('Content-Type: application/json; charset=utf-8');

// =============================================
// ПОЛУЧАЕМ ДАННЫЕ
// =============================================
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$source = trim($_POST['source'] ?? 'Не указан');
$consent = !empty($_POST['consent']) ? 'да' : 'нет';
$newsletter = !empty($_POST['newsletter']) ? 'да' : 'нет';

// =============================================
// ВАЛИДАЦИЯ
// =============================================
$errors = [];

if (strlen($name) < 2) {
    $errors['name'] = 'Имя слишком короткое';
}

$phoneDigits = preg_replace('/\D/', '', $phone);
if (!preg_match('/^[78]?\d{10}$/', $phoneDigits)) {
    $errors['phone'] = 'Неверный формат телефона';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Неверный формат email';
}

if (empty($_POST['consent'])) {
    $errors['consent'] = 'Необходимо согласие на обработку данных';
}

if (empty($_POST['newsletter'])) {
    $errors['newsletter'] = 'Необходимо согласие на рассылку';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'validation_failed', 'fields' => $errors]);
    exit;
}

// Honeypot защита
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

// =============================================
// ЗАПИСЬ В ФАЙЛ
// =============================================
$date = date('d.m.Y H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$baseDir = dirname(__DIR__);
$leadsDir = $baseDir . '/leads_data';
$filename = $leadsDir . '/leads_' . date('Y-m-d') . '.txt';

// Создаём папку, если её нет
if (!is_dir($leadsDir)) {
    mkdir($leadsDir, 0755, true);
}

// Формируем строку для записи
$line = "[{$date}] | {$source} | Имя: {$name} | Телефон: {$phone} | Email: {$email} | Согласие: {$consent} | Рассылка: {$newsletter} | IP: {$ip}\n";

// Записываем в файл
$result = file_put_contents($filename, $line, FILE_APPEND | LOCK_EX);

// =============================================
// ОТВЕТ
// =============================================
if ($result !== false) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'write_failed']);
}