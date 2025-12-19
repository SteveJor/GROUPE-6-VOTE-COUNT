package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ElectionConfig {
    @Id
    private Long id = 1L; // Singleton configuration

    private LocalDateTime debutVote;
    private LocalDateTime finVote;
}
