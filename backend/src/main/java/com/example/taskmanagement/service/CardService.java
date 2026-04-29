package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.CardResponse;
import com.example.taskmanagement.dto.CreateCardRequest;
import com.example.taskmanagement.entity.Card;
import com.example.taskmanagement.entity.TaskColumn;
import com.example.taskmanagement.repository.CardRepository;
import com.example.taskmanagement.repository.TaskColumnRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;
    private final TaskColumnRepository columnRepository;

    public CardService(CardRepository cardRepository, TaskColumnRepository columnRepository) {
        this.cardRepository = cardRepository;
        this.columnRepository = columnRepository;
    }

    public List<CardResponse> findAll() {
        return cardRepository.findAllOrdered().stream()
                .map(CardResponse::from)
                .toList();
    }

    public CardResponse findById(Long id) {
        return cardRepository.findById(id)
                .map(CardResponse::from)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + id));
    }

    @Transactional
    public CardResponse create(CreateCardRequest req) {
        TaskColumn column = columnRepository.findById(req.columnId())
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + req.columnId()));

        int nextPos = cardRepository.findMaxPositionByColumnId(req.columnId()) + 1;
        LocalDateTime now = LocalDateTime.now();

        Card card = new Card();
        card.setColumn(column);
        card.setTitle(req.title().strip());
        card.setPriority(req.priority());
        card.setDueDate(req.dueDate());
        card.setPosition(nextPos);
        card.setCreatedAt(now);
        card.setUpdatedAt(now);

        return CardResponse.from(cardRepository.save(card));
    }
}
