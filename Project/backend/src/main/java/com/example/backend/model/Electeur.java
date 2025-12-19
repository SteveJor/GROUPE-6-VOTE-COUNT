package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Electeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String region;

    @Column(unique = true, nullable = false)
    private String numeroCNI;

    private String photo; // URL or Base64
    private LocalDateTime dateInscription;
    private boolean aVote; // Status to check if user has voted
    private String signature; // Security password for voting

    @Column(unique = true)
    private String email;

    private String password;

    @PrePersist
    protected void onCreate() {
        this.dateInscription = LocalDateTime.now();
        this.aVote = false;
    }
}
