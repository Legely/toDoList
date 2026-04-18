package com.legely.todo.controller;

import com.legely.todo.model.Task;
import com.legely.todo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Разрешаем фронтенду обращаться к серверу
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public Task createTask(@RequestBody Task task) {  
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        return taskRepository.save(task); // Сохраняет в SQLite и возвращает карточку с ID
    }
}
