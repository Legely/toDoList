// Ждем, пока вся HTML-страница полностью загрузится
document.addEventListener('DOMContentLoaded', () => {

    // 1. Достаем имя пользователя из localStorage
    const savedUsername = localStorage.getItem('currentUsername');

    // 2. Находим наш span по ID
    const userSpan = document.getElementById('userName');

    // 3. Проверяем, есть ли данные
    if (savedUsername) {
        // Если пользователь найден, меняем текст внутри span
        userSpan.textContent = savedUsername;
    } else {
        // Защита: если данных нет (человек просто вбил ссылку app.html),
        // отправляем его обратно на страницу входа/регистрации
        window.location.href = 'index.html';
    }
});

function logout() {
    localStorage.removeItem('currentUsername');

    window.location.href = 'index.html';
}