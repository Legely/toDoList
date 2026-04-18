// Глобальная переменная текущего пользователя
const savedUsername = localStorage.getItem('currentUsername');

// Ждем, пока вся HTML-страница полностью загрузится
document.addEventListener('DOMContentLoaded', () => {
    const userSpan = document.getElementById('userName');

    // Проверяем, есть ли данные авторизации
    if (savedUsername) {
        userSpan.textContent = savedUsername;
    } else {
        // Защита: если данных нет, отправляем обратно на страницу входа
        window.location.href = 'index.html';
    }

    // Сразу загружаем задачи из базы данных при открытии страницы
    fetchTasks();
});

// Функция выхода
function logout() {
    localStorage.removeItem('currentUsername');
    window.location.href = 'index.html';
}

// Функция разворачивания/сворачивания карточки задачи
function toggleTask(cardElement) {
    cardElement.classList.toggle('active');
}

// Предотвращаем сворачивание карточки, если кликнули по кнопкам внутри
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
    document.getElementById('deadlineGroup').style.display = 'none';
    document.getElementById('editTaskId').value = ''; // Очищаем скрытый ID
}

// Закрытие модалки при клике на темный фон вне ее
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Показать/скрыть выбор даты
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

// Отправка формы (Создание новой или Обновление существующей задачи)
document.getElementById('newTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const priority = document.getElementById('taskPriority').value;

    const hasDeadline = document.getElementById('hasDeadline').checked;
    const deadline = hasDeadline ? document.getElementById('taskDate').value : null;

    // Собираем объект задачи, обязательно передаем имя владельца
    const taskData = {
        title: title,
        description: desc,
        priority: priority,
        deadline: deadline,
        status: 'TODO',
        username: savedUsername
    };

    const editId = document.getElementById('editTaskId').value;
    // Если есть editId, значит это обновление (PUT), иначе создание (POST)
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8080/api/tasks/${editId}` : 'http://localhost:8080/api/tasks';

    // Если это обновление, нужно сохранить старый статус задачи, чтобы она не улетела обратно в TODO
    if (editId) {
        const existingCard = document.querySelector(`.taskCard[data-id="${editId}"]`);
        if (existingCard) {
            // Определяем текущий статус по тому, в какой колонке находится карточка
            if (existingCard.closest('#taskListInProgress')) taskData.status = 'IN_PROGRESS';
            else if (existingCard.closest('#taskListDone')) taskData.status = 'DONE';
        }
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            fetchTasks();
            closeModal();
        } else {
            console.error('Ошибка при сохранении задачи');
        }
    } catch (error) {
        console.error('Сервер недоступен:', error);
    }
});

// Получение всех задач текущего пользователя
async function fetchTasks() {
    try {
        const response = await fetch(`http://localhost:8080/api/tasks/user/${savedUsername}`);

        if (response.ok) {
            const tasks = await response.json();

            // Очищаем колонки перед отрисовкой
            document.getElementById('taskListToDo').innerHTML = '';
            document.getElementById('taskListInProgress').innerHTML = '';
            document.getElementById('taskListDone').innerHTML = '';

            // Раскидываем задачи
            tasks.forEach(task => {
                const taskCard = createTaskElement(task);

                if (task.status === 'TODO') {
                    document.getElementById('taskListToDo').appendChild(taskCard);
                } else if (task.status === 'IN_PROGRESS') {
                    document.getElementById('taskListInProgress').appendChild(taskCard);
                } else if (task.status === 'DONE') {
                    document.getElementById('taskListDone').appendChild(taskCard);
                }
            });

            // Обновляем счетчики колонок
            updateCounters();
        }
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
    }
}

// Генерация HTML-карточки
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'taskCard';
    div.dataset.id = task.id;
    div.onclick = function() { toggleTask(this); };

    let badgeClass = '';
    let priorityText = '';
    if (task.priority === 'HIGH') {
        badgeClass = 'badgeHigh';
        priorityText = 'High';
    } else if (task.priority === 'MEDIUM') {
        badgeClass = 'badgeMed';
        priorityText = 'Med';
    } else {
        badgeClass = 'badgeLow';
        priorityText = 'Low';
    }

    let deadlineHtml = task.deadline ?
        `<span class="taskDate">${task.deadline}</span>` :
        `<span class="taskDate">Без срока</span>`;

    // Определяем, какие кнопки показывать в зависимости от колонки
    let actionButtons = '';
    if (task.status === 'TODO') {
        actionButtons = `
            <button type="button" class="iconBtn" title="Редактировать" onclick="openEditModal(${task.id})">✎</button>
            <button type="button" class="iconBtn" title="Удалить" onclick="deleteTask(${task.id})">✖</button>
            <button type="button" class="btnSmall moveBtn" onclick="moveTask(${task.id}, 'IN_PROGRESS')">В работу ➜</button>
        `;
    } else if (task.status === 'IN_PROGRESS') {
        actionButtons = `
            <button type="button" class="iconBtn" title="Редактировать" onclick="openEditModal(${task.id})">✎</button>
            <button type="button" class="iconBtn" title="Удалить" onclick="deleteTask(${task.id})">✖</button>
            <button type="button" class="btnSmall moveBtn" onclick="moveTask(${task.id}, 'DONE')">Готово ✔</button>
        `;
    } else {
        actionButtons = `
            <button type="button" class="iconBtn" title="Удалить" onclick="deleteTask(${task.id})">✖</button>
            <button type="button" class="btnSmall moveBtn" style="background-color: #555;" onclick="moveTask(${task.id}, 'TODO')">↩ Вернуть</button>
        `;
    }

    div.innerHTML = `
        <div class="taskHeader">
            <span class="priority ${badgeClass}">${priorityText}</span>
        </div>
        <h4 class="taskTitle">${task.title}</h4>
        <p class="taskDesc">${task.description}</p>
        <div class="taskFooter">
            ${deadlineHtml}
            <div class="taskActions">
                ${actionButtons}
            </div>
        </div>
    `;

    return div;
}

// Открытие модалки для редактирования
function openEditModal(id) {
    const card = document.querySelector(`.taskCard[data-id="${id}"]`);

    document.getElementById('taskTitle').value = card.querySelector('.taskTitle').textContent;
    document.getElementById('taskDesc').value = card.querySelector('.taskDesc').textContent;

    const badge = card.querySelector('.priority');
    if (badge.classList.contains('badgeHigh')) document.getElementById('taskPriority').value = 'HIGH';
    else if (badge.classList.contains('badgeMed')) document.getElementById('taskPriority').value = 'MEDIUM';
    else document.getElementById('taskPriority').value = 'LOW';

    const dateText = card.querySelector('.taskDate').textContent;
    if (dateText && dateText !== 'Без срока') {
        document.getElementById('hasDeadline').checked = true;
        document.getElementById('deadlineGroup').style.display = 'block';
        document.getElementById('taskDate').value = dateText;
    } else {
        document.getElementById('hasDeadline').checked = false;
        document.getElementById('deadlineGroup').style.display = 'none';
        document.getElementById('taskDate').value = '';
    }

    document.getElementById('editTaskId').value = id;
    openModal();
}

// Удаление задачи
async function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;

    try {
        const response = await fetch(`http://localhost:8080/api/tasks/${id}`, { method: 'DELETE' });
        if (response.ok) {
            const card = document.querySelector(`.taskCard[data-id="${id}"]`);
            if (card) card.remove();
            updateCounters();
        } else {
            alert('Ошибка при удалении');
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}

// Перемещение задачи (смена статуса)
async function moveTask(id, newStatus) {
    const card = document.querySelector(`.taskCard[data-id="${id}"]`);

    // Собираем данные карточки
    const title = card.querySelector('.taskTitle').textContent;
    const desc = card.querySelector('.taskDesc').textContent;
    const badge = card.querySelector('.priority');
    let priority = 'LOW';
    if (badge.classList.contains('badgeHigh')) priority = 'HIGH';
    if (badge.classList.contains('badgeMed')) priority = 'MEDIUM';

    const dateText = card.querySelector('.taskDate').textContent;
    const deadline = (dateText && dateText !== 'Без срока') ? dateText : null;

    const updatedTask = {
        title: title,
        description: desc,
        priority: priority,
        deadline: deadline,
        status: newStatus,
        username: savedUsername
    };

    try {
        const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Ошибка перемещения:', error);
    }
}

// Обновление цифр (количества задач) в заголовках колонок
function updateCounters() {
    const todoCount = document.getElementById('taskListToDo').children.length;
    const inProgressCount = document.getElementById('taskListInProgress').children.length;
    const doneCount = document.getElementById('taskListDone').children.length;

    // Находим span'ы рядом с заголовками и обновляем их
    const headers = document.querySelectorAll('.columnHeader span');
    if (headers.length >= 3) {
        headers[0].textContent = todoCount;
        headers[1].textContent = inProgressCount;
        headers[2].textContent = doneCount;
    }
}