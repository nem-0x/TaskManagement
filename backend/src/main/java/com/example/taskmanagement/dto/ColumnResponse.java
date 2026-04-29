package com.example.taskmanagement.dto;

import com.example.taskmanagement.entity.TaskColumn;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record ColumnResponse(
        Long id,
        String title,
        Integer position,
        @JsonProperty("is_default") boolean isDefault,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("updated_at") LocalDateTime updatedAt,
        List<CardResponse> cards
) {
    public static ColumnResponse from(TaskColumn column) {
        List<CardResponse> cardDtos = column.getCards().stream()
                .map(CardResponse::from)
                .toList();
        return new ColumnResponse(
                column.getId(),
                column.getTitle(),
                column.getPosition(),
                column.isDefault(),
                column.getCreatedAt(),
                column.getUpdatedAt(),
                cardDtos
        );
    }
}
