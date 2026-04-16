document.addEventListener('DOMContentLoaded', () => {
    // Получаем основные элементы
    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('new-task-form');
    const todoList = document.getElementById('todo-list');

    // Получаем кнопки для работы с модальным окном
    const openModalBtn = document.querySelector('.add-task-btn');
    const cancelBtn = taskModal.querySelector('.btn-outline');

    // 1. Управление модальным окном
    openModalBtn.addEventListener('click', () => {
        taskModal.classList.add('active');
        // Очищаем форму при открытии
        taskForm.reset();
    });

    cancelBtn.addEventListener('click', () => {
        taskModal.classList.remove('active');
    });

    // 2. Добавление новой задачи
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        // Собираем данные из инпутов
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;

        // Создаем HTML элемент новой карточки
        const taskCard = createTaskElement(title, desc, priority);

        // Добавляем карточку в колонку "К выполнению" (todoList)
        todoList.appendChild(taskCard);

        // Закрываем окно и обновляем счетчики
        taskModal.classList.remove('active');
        updateCounters();
    });

    // 3. Функция создания HTML-карточки задачи
    function createTaskElement(title, desc, priority) {
        const div = document.createElement('div');
        div.className = 'task-card';

        // Определяем класс и текст для метки приоритета
        let badgeClass = '';
        let badgeText = '';
        if (priority === 'HIGH') {
            badgeClass = 'badge-high';
            badgeText = 'High';
        } else if (priority === 'MEDIUM') {
            badgeClass = 'badge-med';
            badgeText = 'Med';
        } else {
            badgeClass = 'badge-low';
            badgeText = 'Low';
        }

        // Получаем текущую дату (например: 15 Апр 2026)
        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const currentDate = new Date().toLocaleDateString('ru-RU', dateOptions);

        // Заполняем внутренний HTML карточки
        div.innerHTML = `
            <div class="task-header">
                <span class="priority ${badgeClass}">${badgeText}</span>
                <div class="task-actions">
                    <button class="icon-btn delete-btn" title="Удалить">✖</button>
                </div>
            </div>
            <h4 class="task-title">${title}</h4>
            <p class="task-desc">${desc}</p>
            <div class="task-footer">
                <span class="task-date">${currentDate}</span>
                <button class="btn btn-small move-btn">В работу ➜</button>
            </div>
        `;

        // Добавляем слушатели событий на кнопки внутри этой карточки
        attachCardEvents(div);

        return div;
    }

    // 4. Логика кнопок внутри карточки (Удаление и Перемещение)
    function attachCardEvents(card) {
        const deleteBtn = card.querySelector('.delete-btn');
        const moveBtn = card.querySelector('.move-btn');

        // Удаление
        deleteBtn.addEventListener('click', () => {
            // Анимация затухания перед удалением (необязательно, но красиво)
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                updateCounters();
            }, 300); // Ждем 300мс пока пройдет анимация из CSS
        });

        // Перемещение по статусам
        if (moveBtn) {
            moveBtn.addEventListener('click', () => {
                const currentList = card.parentElement;

                if (currentList.id === 'todo-list') {
                    // Перемещаем в "В процессе"
                    document.getElementById('in-progress-list').appendChild(card);
                    moveBtn.innerText = 'Завершить ✔';
                    moveBtn.style.backgroundColor = '#10b981'; // Меняем цвет на зеленый (опционально)
                } else if (currentList.id === 'in-progress-list') {
                    // Перемещаем в "Готово"
                    document.getElementById('done-list').appendChild(card);
                    moveBtn.remove(); // В колонке "Готово" кнопка перемещения больше не нужна
                }

                updateCounters();
            });
        }
    }

    // 5. Обновление счетчиков задач в шапках колонок
    function updateCounters() {
        // Считаем карточки внутри каждого списка
        const todoCount = document.getElementById('todo-list').querySelectorAll('.task-card').length;
        const inProgressCount = document.getElementById('in-progress-list').querySelectorAll('.task-card').length;
        const doneCount = document.getElementById('done-list').querySelectorAll('.task-card').length;

        // Находим счетчики в DOM и обновляем их текст
        // Используем .previousElementSibling, чтобы найти блок заголовка над текущим списком
        document.getElementById('todo-list').previousElementSibling.querySelector('.task-count').innerText = todoCount;
        document.getElementById('in-progress-list').previousElementSibling.querySelector('.task-count').innerText = inProgressCount;
        document.getElementById('done-list').previousElementSibling.querySelector('.task-count').innerText = doneCount;
    }

    // 6. Инициализация существующих карточек
    // Чтобы кнопки на карточках, написанных прямо в HTML, тоже работали
    document.querySelectorAll('.task-card').forEach(card => {
        attachCardEvents(card);
    });

    // Первоначальный подсчет задач при загрузке страницы
    updateCounters();

    // 7. Кнопка выхода (заглушка для будущего бэкенда)
    document.getElementById('logout-btn').addEventListener('click', () => {
        // Здесь в будущем ты будешь удалять JWT токен
        // localStorage.removeItem('token');
        window.location.href = 'index.html'; // Возврат на страницу логина
    });
});