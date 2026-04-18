package com.legely.todo.repository;

import com.legely.todo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Spring сам поймет, что нужно сделать SELECT * FROM tasks WHERE username = ?
    List<Task> findByUsername(String username);
}