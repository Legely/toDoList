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


// Перехват отправки форм
document.getElementById('login').addEventListener('submit', async(e) => {
    e.preventDefault();

    // Получаем значения по ID инпутов, которые ты прописал в HTML
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;

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
            localStorage.setItem('currentUser', result.user);
            localStorage.setItem('currentUsername', userData.username);
            window.location.href = 'app.html';
        } else {
            console.log('Ошибка входа:', result.error);

        }
    } catch (error) {
        console.error('Ошибка соединения с сервером:', error);
    }
});


document.getElementById('register').addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;
    const passwordRepeat = document.getElementById('regPasswordRepeat').value;


    console.log('Попытка регистрации:', { name, password, passwordRepeat });

    // Собираем объект для отправки на сервер
    const userData = {
        username: name,
        password: password
    };

    if (password !== passwordRepeat) {
        console.log('Пароли не совподают');
    } else {
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message);
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
            } else {
                console.log('Ошибка регистрации:', result.error);
            }
        } catch (error) {
            console.error('Ошибка соединения с сервером:', error);
        }
    }
});