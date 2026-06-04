package com.stagefront.catalog.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Enterprise Concert Entity
 * Maps directly to the stagefront_db PostgreSQL instance.
 * Demonstrates advanced ORM mapping and auditing.
 */
@Entity
@Table(name = "concerts", indexes = {
    @Index(name = "idx_concert_date", columnList = "event_date"),
    @Index(name = "idx_concert_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Concert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "min_price")
    private Long minPrice;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "SCHEDULED"; // SCHEDULED, SOLD_OUT, CANCELLED

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "concert_genres", joinColumns = @JoinColumn(name = "concert_id"))
    @Column(name = "genre")
    private List<String> genres;

    @Version
    @Column(name = "version")
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
