package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.ColumnResponse;
import com.example.taskmanagement.dto.CreateColumnRequest;
import com.example.taskmanagement.service.ColumnService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        return ResponseEntity.ok(columnService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ColumnResponse> createColumn(@Valid @RequestBody CreateColumnRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(columnService.create(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        columnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
