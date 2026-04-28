package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.CardResponse;
import com.example.taskmanagement.repository.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
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
}
