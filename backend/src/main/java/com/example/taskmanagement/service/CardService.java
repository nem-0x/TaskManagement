package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.CardResponse;
import com.example.taskmanagement.dto.CreateCardRequest;
import com.example.taskmanagement.dto.UpdateCardRequest;
import com.example.taskmanagement.entity.Card;
import com.example.taskmanagement.entity.TaskColumn;
import com.example.taskmanagement.repository.CardRepository;
import com.example.taskmanagement.repository.TaskColumnRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class CardService {

    private static final Logger log = LoggerFactory.getLogger(CardService.class);

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
        log.info("Creating card: title={}, columnId={}", req.title(), req.columnId());
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

        CardResponse response = CardResponse.from(cardRepository.save(card));
        log.info("Created card id={}", response.id());
        return response;
    }

    @Transactional
    public CardResponse update(Long id, UpdateCardRequest req) {
        log.info("Updating card id={}", id);
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + id));

        req.getTitle().ifPresent(t -> card.setTitle(t.strip()));
        req.getPriority().ifPresent(card::setPriority);
        req.getDueDate().ifPresent(card::setDueDate);

        boolean columnChanged = req.getColumnId().isPresent()
                && !req.getColumnId().get().equals(card.getColumn().getId());

        if (columnChanged) {
            Long sourceColId = card.getColumn().getId();
            Long targetColId = req.getColumnId().get();
            int targetPos = req.getPosition().orElse(
                    cardRepository.findMaxPositionByColumnId(targetColId) + 1);
            TaskColumn targetColumn = columnRepository.findById(targetColId)
                    .orElseThrow(() -> new NoSuchElementException("Column not found: " + targetColId));

            List<Card> srcCards = new ArrayList<>(
                    cardRepository.findByColumnIdOrderedByPosition(sourceColId));
            srcCards.removeIf(c -> c.getId().equals(card.getId()));
            for (int i = 0; i < srcCards.size(); i++) srcCards.get(i).setPosition(i + 1);

            List<Card> dstCards = new ArrayList<>(
                    cardRepository.findByColumnIdOrderedByPosition(targetColId));
            card.setColumn(targetColumn);
            dstCards.add(Math.min(targetPos - 1, dstCards.size()), card);
            for (int i = 0; i < dstCards.size(); i++) dstCards.get(i).setPosition(i + 1);

        } else if (req.getPosition().isPresent()) {
            Long colId = card.getColumn().getId();
            int targetPos = req.getPosition().get();
            List<Card> cards = new ArrayList<>(
                    cardRepository.findByColumnIdOrderedByPosition(colId));
            cards.removeIf(c -> c.getId().equals(card.getId()));
            cards.add(Math.min(targetPos - 1, cards.size()), card);
            for (int i = 0; i < cards.size(); i++) cards.get(i).setPosition(i + 1);
        }

        card.setUpdatedAt(LocalDateTime.now());
        return CardResponse.from(cardRepository.save(card));
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting card id={}", id);
        if (!cardRepository.existsById(id)) {
            throw new NoSuchElementException("Card not found: " + id);
        }
        cardRepository.deleteById(id);
    }
}
