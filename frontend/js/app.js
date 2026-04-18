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
        // Защита: если данных нет, отправляем обратно
        window.location.href = 'index.html';
    }

    // 2. Сразу загружаем задачи из базы данных при открытии страницы
    fetchTasks();
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

// Закрытие модального окна и очистка формы
function closeModal() {
    modal.classList.remove('active');
    document.getElementById('newTaskForm').reset();
    document.getElementById('deadlineGroup').style.display = 'none'; // Скрываем поле даты обратно
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

// --- ИНТЕГРАЦИЯ С JAVA BACKEND ---

// Сбор данных при отправке формы и POST-запрос
document.getElementById('newTaskForm').addEventListener('submit', async function(e) {
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
        deadline: deadline,
        status: 'TODO' // Новая задача всегда падает в колонку "К выполнению"
    };

    try {
        // Отправляем JSON на Spring Boot сервер
        const response = await fetch('http://localhost:8080/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const savedTask = await response.json();
            console.log('Задача успешно сохранена в БД:', savedTask);

            // Создаем карточку и добавляем в колонку
            const taskCard = createTaskElement(savedTask);
            document.getElementById('todo-list').appendChild(taskCard);

            closeModal();
        } else {
            console.error('Ошибка сохранения на сервере');
        }
    } catch (error) {
        console.error('Сервер недоступен:', error);
        alert('Не удалось подключиться к серверу! Проверьте, запущен ли Spring Boot.');
    }
});

// Функция получения всех задач (GET-запрос)
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:8080/api/tasks');

        if (response.ok) {
            const tasks = await response.json();

            // Очищаем колонки перед отрисовкой
            document.getElementById('todo-list').innerHTML = '';
            // document.getElementById('in-progress-list').innerHTML = '';
            // document.getElementById('done-list').innerHTML = '';

            // Раскидываем задачи по колонкам
            tasks.forEach(task => {
                const taskCard = createTaskElement(task);

                if (task.status === 'TODO') {
                    document.getElementById('todo-list').appendChild(taskCard);
                }
                // Добавь проверки для IN_PROGRESS и DONE, если у тебя есть эти колонки
            });
        }
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
    }
}

// Функция генерации HTML-карточки
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.dataset.id = task.id; // Прячем ID для будущего удаления/обновления

    // Добавляем функцию сворачивания по клику на саму карточку
    div.onclick = function() { toggleTask(this); };

    // Настраиваем цвета в зависимости от приоритета
    let badgeClass = '';
    if (task.priority === 'HIGH') badgeClass = 'badge-high';
    else if (task.priority === 'MEDIUM') badgeClass = 'badge-med';
    else badgeClass = 'badge-low';

    // Формируем блок с дедлайном, если он есть
    let deadlineHtml = '';
    if (task.deadline) {
        deadlineHtml = `<span class="task-date" style="color: var(--primary-color); font-weight: bold;">До: ${task.deadline}</span>`;
    }

    div.innerHTML = `
        <div class="task-header">
            <span class="priority ${badgeClass}">${task.priority}</span>
            <div class="taskActions"> <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})">✖</button>
            </div>
        </div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-desc">${task.description}</p>
        <div class="task-footer">
            ${deadlineHtml}
        </div>
    `;

    return div;
}

// Заглушка для функции удаления (чтобы кнопка ✖ не выдавала ошибку)
function deleteTask(id) {
    console.log('Удаление задачи с ID:', id);
    // В будущем здесь будет fetch с методом DELETE
}