package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.ColumnResponse;
import com.example.taskmanagement.dto.CreateColumnRequest;
import com.example.taskmanagement.entity.TaskColumn;
import com.example.taskmanagement.repository.TaskColumnRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class ColumnService {

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
        int nextPos = columnRepository.findMaxPosition() + 1;
        LocalDateTime now = LocalDateTime.now();

        TaskColumn col = new TaskColumn();
        col.setTitle(req.title().strip());
        col.setPosition(nextPos);
        col.setCreatedAt(now);
        col.setUpdatedAt(now);

        return ColumnResponse.from(columnRepository.save(col));
    }
}
