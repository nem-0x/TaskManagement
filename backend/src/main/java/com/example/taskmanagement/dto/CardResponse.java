package com.example.taskmanagement.dto;

import com.example.taskmanagement.entity.Card;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CardResponse(
        Long id,
        @JsonProperty("column_id") Long columnId,
        String title,
        String priority,
        @JsonProperty("due_date") LocalDate dueDate,
        Integer position,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("updated_at") LocalDateTime updatedAt
) {
    public static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getColumn().getId(),
                card.getTitle(),
                card.getPriority(),
                card.getDueDate(),
                card.getPosition(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}
