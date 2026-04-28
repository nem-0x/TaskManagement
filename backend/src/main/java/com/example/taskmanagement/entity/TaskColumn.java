package com.example.taskmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "task_columns")
public class TaskColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "column", fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    private List<Card> cards = new ArrayList<>();

    public TaskColumn() {}

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }
    public String getTitle()                   { return title; }
    public void setTitle(String title)         { this.title = title; }
    public Integer getPosition()               { return position; }
    public void setPosition(Integer position)  { this.position = position; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public void setCreatedAt(LocalDateTime v)  { this.createdAt = v; }
    public LocalDateTime getUpdatedAt()        { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)  { this.updatedAt = v; }
    public List<Card> getCards()               { return cards; }
    public void setCards(List<Card> cards)     { this.cards = cards; }
}
