package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.ColumnResponse;
import com.example.taskmanagement.dto.CreateColumnRequest;
import com.example.taskmanagement.service.ColumnService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/columns")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping
    public List<ColumnResponse> getAllColumns() {
        return columnService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColumnResponse> getColumn(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(columnService.findById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ColumnResponse> createColumn(@Valid @RequestBody CreateColumnRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(columnService.create(req));
    }
}
