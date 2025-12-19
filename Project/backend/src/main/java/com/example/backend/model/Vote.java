package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "electeur_id", nullable = false)
    private Electeur electeur;

    @ManyToOne
    @JoinColumn(name = "parti_id", nullable = false)
    private PartiPolitique partiPolitique;

    private LocalDateTime dateVote;

    @PrePersist
    protected void onCreate() {
        this.dateVote = LocalDateTime.now();
    }
}
