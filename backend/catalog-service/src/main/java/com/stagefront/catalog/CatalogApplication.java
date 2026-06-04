package com.stagefront.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Catalog Service
 * Manages concerts, artists, and venues.
 * Connects to PostgreSQL and Redis for fast data retrieval via CQRS.
 */
@SpringBootApplication
public class CatalogApplication {

    public static void main(String[] args) {
        SpringApplication.run(CatalogApplication.class, args);
    }
}
