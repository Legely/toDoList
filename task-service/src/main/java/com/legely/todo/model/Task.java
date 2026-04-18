package com.legely.todo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String priority;

    // Поле для дедлайна (может быть null, если галочка не стоит)
    private LocalDate deadline;

    private String status = "TODO"; // По умолчанию задача новая
}
