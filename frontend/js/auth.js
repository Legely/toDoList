// Получаем элементы форм
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Получаем ссылки-переключатели
const goToLogin = document.getElementById('goToLogin');
const goToRegister = document.getElementById('goToRegister');

// логика переключения Войти\Регистрация
goToRegister.addEventListener('click', () => {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

goToLogin.addEventListener('click', () => {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});


// Перехват отправки форм авторизации
document.getElementById('login').addEventListener('submit', async(e) => {
    e.preventDefault();

    // Получаем значения и убираем лишние пробелы по краям с помощью trim()
    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value;

    // ПРОВЕРКА 1: Заполнены ли поля
    if (!name || !password) {
        alert('Пожалуйста, введите имя пользователя и пароль.');
        return; // Останавливаем выполнение
    }

    console.log('Попытка входа:', { name, password });

    // Собираем объект для отправки на сервер
    const userData = {
        username: name,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result.message + ` Привет, ${result.user}!`);

            // Здесь сохраняем юзера и делаем переход в само приложение
            localStorage.setItem('currentUser', result.user || name);
            localStorage.setItem('currentUsername', userData.username);

            // Если всё отлично, можно показать алерт и перевести на страницу приложения
            alert('Успешный вход!');
            window.location.href = 'app.html';
        } else {
            console.log('Ошибка входа:', result.message || result.error);
            // ПРОВЕРКА 2: Ошибка от сервера (например, неверный пароль)
            alert(`Не удалось войти: ${result.message || 'Неверный логин или пароль'}`);
        }
    } catch (error) {
        console.error('Ошибка соединения с сервером:', error);
        // ПРОВЕРКА 3: Сервер выключен
        alert('Сервер недоступен. Проверьте, запущен ли Node.js.');
    }
});


// Перехват отправки формы регистрации
document.getElementById('register').addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const password = document.getElementById('regPassword').value;
    const passwordRepeat = document.getElementById('regPasswordRepeat').value;

    // ПРОВЕРКА 1: Заполнены ли все поля
    if (!name || !password || !passwordRepeat) {
        alert('Пожалуйста, заполните все поля для регистрации.');
        return;
    }

    // ПРОВЕРКА 2: Совпадают ли пароли
    if (password !== passwordRepeat) {
        console.log('Пароли не совпадают');
        alert('Ошибка: Пароли не совпадают. Попробуйте ввести их снова.');
        return;
    }

    // ПРОВЕРКА 3: Длина пароля (для безопасности)
    if (password.length < 4) {
        alert('Пароль слишком короткий. Придумайте пароль минимум из 4 символов.');
        return;
    }

    console.log('Попытка регистрации:', { name, password, passwordRepeat });

    // Собираем объект для отправки на сервер
    const userData = {
        username: name,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result.message);
            // Успешная регистрация
            alert('Регистрация успешно завершена! Теперь вы можете войти.');

            // Очищаем форму регистрации и переключаем на окно входа
            document.getElementById('register').reset();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        } else {
            console.log('Ошибка регистрации:', result.message || result.error);
            // ПРОВЕРКА 4: Ошибка от сервера (например, имя уже занято)
            alert(`Ошибка регистрации: ${result.message || 'Пользователь уже существует'}`);
        }
    } catch (error) {
        console.error('Ошибка соединения с сервером:', error);
        alert('Сервер недоступен. Проверьте, запущен ли Node.js.');
    }
});