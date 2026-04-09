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
document.getElementById('login').addEventListener('submit', (e) => {
    e.preventDefault(); // Останавливаем стандартную перезагрузку страницы
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Попытка входа:', { name, password });

});


document.getElementById('register').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;
    const passwordRepeat = document.getElementById('regPasswordRepeat').value;

    if (password !== passwordRepeat) {
        console.log('Пароли не совподают')
    } else {
        console.log('Попытка регистрации:', { name, password, passwordRepeat });
    }



});