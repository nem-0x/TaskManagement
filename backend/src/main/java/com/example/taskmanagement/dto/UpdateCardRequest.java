package com.example.taskmanagement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

import java.time.LocalDate;
import java.util.Optional;

public class UpdateCardRequest {

    private Optional<String> title = Optional.empty();

    private Optional<String> priority = Optional.empty();

    private Optional<LocalDate> dueDate = Optional.empty();

    private Optional<Long> columnId = Optional.empty();

    private Optional<Integer> position = Optional.empty();

    public Optional<String> getTitle() { return title; }
    public void setTitle(String title) { this.title = Optional.ofNullable(title); }

    public Optional<String> getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = Optional.ofNullable(priority); }

    public Optional<LocalDate> getDueDate() { return dueDate; }

    @JsonProperty("due_date")
    @JsonSetter(nulls = Nulls.AS_EMPTY)
    public void setDueDate(LocalDate dueDate) { this.dueDate = Optional.ofNullable(dueDate); }

    public Optional<Long> getColumnId() { return columnId; }

    @JsonProperty("column_id")
    public void setColumnId(Long columnId) { this.columnId = Optional.ofNullable(columnId); }

    public Optional<Integer> getPosition() { return position; }
    public void setPosition(Integer position) { this.position = Optional.ofNullable(position); }
}
