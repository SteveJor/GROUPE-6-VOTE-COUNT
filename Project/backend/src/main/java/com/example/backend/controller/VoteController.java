package com.example.backend.controller;

import com.example.backend.model.PartiPolitique;
import com.example.backend.repository.PartiPolitiqueRepository;
import com.example.backend.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vote")
@CrossOrigin(origins = "*")
public class VoteController {
    @Autowired
    private VoteService voteService;

    @Autowired
    private PartiPolitiqueRepository partiPolitiqueRepository;

    @PostMapping("/voter")
    public ResponseEntity<?> voter(@RequestParam Long electeurId, @RequestParam Long partiId,
                                   @RequestParam String signature) {
        try {
            voteService.voter(electeurId, partiId, signature);
            return ResponseEntity.ok("Vote enregistre avec succes.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/resultats")
    public List<PartiPolitique> getResultats() {
        return partiPolitiqueRepository.findAll();
    }

    @GetMapping("/repartition-region")
    public ResponseEntity<?> getRepartitionParRegion() {
        return ResponseEntity.ok(voteService.getRepartitionParRegion());
    }

    @GetMapping("/classement-general")
    public ResponseEntity<?> getClassementGeneral() {
        return ResponseEntity.ok(voteService.getClassementGeneral());
    }
}
