package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.TaskColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TaskColumnRepository extends JpaRepository<TaskColumn, Long> {

    @Query("SELECT DISTINCT c FROM TaskColumn c LEFT JOIN FETCH c.cards ORDER BY c.position ASC")
    List<TaskColumn> findAllWithCards();

    @Query("SELECT c FROM TaskColumn c LEFT JOIN FETCH c.cards WHERE c.id = :id")
    Optional<TaskColumn> findByIdWithCards(@Param("id") Long id);

    @Query("SELECT COALESCE(MAX(c.position), 0) FROM TaskColumn c")
    int findMaxPosition();
}
