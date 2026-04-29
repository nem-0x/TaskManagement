package com.example.taskmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    private TaskColumn column;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 10)
    private String priority;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Card() {}

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }
    public TaskColumn getColumn()                { return column; }
    public void setColumn(TaskColumn column)     { this.column = column; }
    public String getTitle()                     { return title; }
    public void setTitle(String title)           { this.title = title; }
    public String getPriority()                  { return priority; }
    public void setPriority(String priority)     { this.priority = priority; }
    public LocalDate getDueDate()                { return dueDate; }
    public void setDueDate(LocalDate dueDate)    { this.dueDate = dueDate; }
    public Integer getPosition()                 { return position; }
    public void setPosition(Integer position)    { this.position = position; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)    { this.updatedAt = v; }
}
