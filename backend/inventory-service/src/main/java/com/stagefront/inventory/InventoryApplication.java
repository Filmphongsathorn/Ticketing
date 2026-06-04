package com.stagefront.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Inventory Service (The Core Engine)
 * Manages Redlock distributed locking for seats.
 * Prevents race conditions and phantom ticketing using Kafka and Redis.
 */
@SpringBootApplication
public class InventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryApplication.class, args);
    }
}
