package com.example.taskmanagement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateCardRequest(
        @NotBlank(message = "Title must not be blank")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,

        @Pattern(regexp = "^(high|medium|low)$", message = "Priority must be high, medium, or low")
        String priority,

        @JsonProperty("due_date")
        LocalDate dueDate,

        @JsonProperty("column_id")
        Long columnId
) {}
