package com.example.backend.controller;

import com.example.backend.model.Electeur;
import com.example.backend.model.PartiPolitique;
import com.example.backend.repository.PartiPolitiqueRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.ElectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private ElectionService electionService;

    @Autowired
    private AuthService authService;

    @Autowired
    private PartiPolitiqueRepository partiPolitiqueRepository;

    @PostMapping("/config-election")
    public ResponseEntity<?> configElection(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        electionService.setElectionPeriod(start, end);
        return ResponseEntity.ok("Periode d'election configuree.");
    }

    @PostMapping("/register-electeur")
    public ResponseEntity<?> registerElecteur(@RequestBody Electeur electeur) {
        authService.register(electeur);
        return ResponseEntity.ok("Electeur enregistre.");
    }
    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestParam String numeroCNI, @RequestParam String password) {
        Electeur electeur = authService.updatePassword(numeroCNI,password);
        return ResponseEntity.ok(Objects.requireNonNullElse(electeur, "Mot de passe configure."));
    }

    @PostMapping("/register-parti")
    public ResponseEntity<?> registerParti(@RequestBody PartiPolitique parti) {
        partiPolitiqueRepository.save(parti);
        return ResponseEntity.ok("Parti politique enregistre.");
    }
    @GetMapping("/partis")
    public ResponseEntity<List<PartiPolitique>> getAllPartis() {
        List<PartiPolitique> partis = partiPolitiqueRepository.findAll();
        return ResponseEntity.ok(partis);
    }

}
