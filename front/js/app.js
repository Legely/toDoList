// Ждем, пока вся HTML-страница полностью загрузится
document.addEventListener('DOMContentLoaded', () => {

    // 1. Достаем имя пользователя из localStorage
    const savedUsername = localStorage.getItem('currentUsername');

    const userSpan = document.getElementById('userName');

    // Проверяем, есть ли данные
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

// Функция разворачивания/сворачивания карточки задачи
function toggleTask(cardElement) {
    cardElement.classList.toggle('active');
}

// Предотвращаем сворачивание карточки, если кликнули по кнопкам внутри (редактировать/удалить)
document.addEventListener('click', function(e) {
    if (e.target.closest('.taskActions')) {
        e.stopPropagation();
    }
});

// Работа с модальным окном
const modal = document.getElementById('taskModal');

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    document.getElementById('newTaskForm').reset();
}

// Закрытие модалки при клике на темный фон вне ее
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});


// Показать/скрыть выбор даты в зависимости от чекбокса
function toggleDateInput() {
    const hasDeadline = document.getElementById('hasDeadline').checked;
    const deadlineGroup = document.getElementById('deadlineGroup');
    const taskDateInput = document.getElementById('taskDate');

    if (hasDeadline) {
        deadlineGroup.style.display = 'block';
    } else {
        deadlineGroup.style.display = 'none';
        taskDateInput.value = '';
    }
}

// Сбор данных при отправке формы
document.getElementById('newTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const priority = document.getElementById('taskPriority').value;

    // Проверяем, установлена ли дата
    const hasDeadline = document.getElementById('hasDeadline').checked;
    const deadline = hasDeadline ? document.getElementById('taskDate').value : null;

    const taskData = {
        title: title,
        description: desc,
        priority: priority,
        deadline: deadline //  Строка с датой, либо null
    };

    console.log('Данные новой задачи:', taskData);

    //  fetch на сервер...

    closeModal();
});

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('active');

    document.getElementById('newTaskForm').reset();
    document.getElementById('deadlineGroup').style.display = 'none'; // Скрываем поле даты обратно
}