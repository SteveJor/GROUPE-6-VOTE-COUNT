package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PartiPolitique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomParti;
    private String president;
    private Long nombreDeVoix;
    private String slogan;

    @Version
    private Long version; // Optimistic locking

    public PartiPolitique() {
        this.nombreDeVoix = 0L;
    }
}
