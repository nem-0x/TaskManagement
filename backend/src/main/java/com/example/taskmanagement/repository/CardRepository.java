package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    @Query("SELECT c FROM Card c ORDER BY c.position ASC")
    List<Card> findAllOrdered();

    @Query("SELECT COALESCE(MAX(c.position), 0) FROM Card c WHERE c.column.id = :columnId")
    int findMaxPositionByColumnId(@Param("columnId") Long columnId);

    @Query("SELECT c FROM Card c WHERE c.column.id = :columnId ORDER BY c.position ASC")
    List<Card> findByColumnIdOrderedByPosition(@Param("columnId") Long columnId);
}
