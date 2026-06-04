package com.stagefront.catalog.controller;

import com.stagefront.catalog.domain.Concert;
import com.stagefront.catalog.service.ConcertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Enterprise Concert REST Controller
 * Provides high-throughput CQRS-based read endpoints for the frontend.
 */
@RestController
@RequestMapping("/api/v1/concerts")
public class ConcertController {

    private final ConcertService concertService;

    public ConcertController(ConcertService concertService) {
        this.concertService = concertService;
    }

    /**
     * Retrieve all trending concerts. Heavily cached in Redis.
     */
    @GetMapping("/trending")
    public ResponseEntity<List<Concert>> getTrendingConcerts() {
        return ResponseEntity.ok(concertService.fetchTrendingConcerts());
    }

    /**
     * Retrieve precise details of a specific concert for booking.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Concert> getConcertById(@PathVariable UUID id) {
        return concertService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Powerful multi-faceted search (Artist, Venue, Genre, Date)
     */
    @GetMapping("/search")
    public ResponseEntity<List<Concert>> searchConcerts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(concertService.search(query, genre, page, size));
    }
}
