package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.ColumnResponse;
import com.example.taskmanagement.dto.CreateColumnRequest;
import com.example.taskmanagement.entity.TaskColumn;
import com.example.taskmanagement.repository.TaskColumnRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class ColumnService {

    private static final Logger log = LoggerFactory.getLogger(ColumnService.class);

    private final TaskColumnRepository columnRepository;

    public ColumnService(TaskColumnRepository columnRepository) {
        this.columnRepository = columnRepository;
    }

    public List<ColumnResponse> findAll() {
        return columnRepository.findAllWithCards().stream()
                .map(ColumnResponse::from)
                .toList();
    }

    public ColumnResponse findById(Long id) {
        return columnRepository.findByIdWithCards(id)
                .map(ColumnResponse::from)
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + id));
    }

    @Transactional
    public ColumnResponse create(CreateColumnRequest req) {
        log.info("Creating column: title={}", req.title());
        int nextPos = columnRepository.findMaxPosition() + 1;
        LocalDateTime now = LocalDateTime.now();

        TaskColumn col = new TaskColumn();
        col.setTitle(req.title().strip());
        col.setPosition(nextPos);
        col.setCreatedAt(now);
        col.setUpdatedAt(now);

        ColumnResponse response = ColumnResponse.from(columnRepository.save(col));
        log.info("Created column id={}", response.id());
        return response;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting column id={}", id);
        TaskColumn col = columnRepository.findByIdWithCards(id)
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + id));
        if (col.isDefault()) {
            throw new IllegalStateException("Cannot delete a default column");
        }
        columnRepository.delete(col);
    }
}
