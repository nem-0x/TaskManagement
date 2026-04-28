package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    @Query("SELECT c FROM Card c ORDER BY c.position ASC")
    List<Card> findAllOrdered();
}
