package com.legely.todo.controller;

import com.legely.todo.model.Task;
import com.legely.todo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // ВАЖНО: разрешает браузеру общаться с сервером без ошибок
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // 1. Метод для загрузки задач (Решит проблему с GET-запросом)
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 2. Метод для создания новой задачи (Решит проблему с alert)
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        return taskRepository.save(task); // Сохраняем в БД и отдаем обратно фронтенду
    }
}