package com.example.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateColumnRequest(
        @NotBlank(message = "Title must not be blank")
        @Size(max = 100, message = "Title must not exceed 100 characters")
        String title
) {}
