package com.example.backend.service;

import com.example.backend.model.Electeur;
import com.example.backend.model.PartiPolitique;
import com.example.backend.model.Vote;
import com.example.backend.repository.ElecteurRepository;
import com.example.backend.repository.PartiPolitiqueRepository;
import com.example.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VoteService {
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private ElecteurRepository electeurRepository;
    @Autowired
    private PartiPolitiqueRepository partiPolitiqueRepository;
    @Autowired
    private ElectionService electionService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void voter(Long electeurId, Long partiId, String signature) {
        if (!electionService.isVoteOpen()) {
            throw new RuntimeException("Le vote est ferme.");
        }

        Electeur electeur = electeurRepository.findById(electeurId)
                .orElseThrow(() -> new RuntimeException("Electeur non trouve"));

        if (electeur.isAVote()) {
            throw new RuntimeException("Vous avez deja vote.");
        }

        // Verify signature
//        if (!passwordEncoder.matches(signature, electeur.getSignature())) {
//            throw new RuntimeException("Signature invalide.");
//        }

        PartiPolitique parti = partiPolitiqueRepository.findById(partiId)
                .orElseThrow(() -> new RuntimeException("Parti politique non trouve"));

        Vote vote = new Vote();
        vote.setElecteur(electeur);
        vote.setPartiPolitique(parti);
        voteRepository.save(vote);

        parti.setNombreDeVoix(parti.getNombreDeVoix() + 1);
        partiPolitiqueRepository.save(parti);

        electeur.setAVote(true);
        electeurRepository.save(electeur);
    }

    public java.util.List<java.util.Map<String, Object>> getRepartitionParRegion() {
        java.util.List<Object[]> results = voteRepository.countVotesByRegion();
        java.util.List<java.util.Map<String, Object>> structuredResults = new java.util.ArrayList<>();

        for (Object[] row : results) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("region", row[0]);
            map.put("parti", row[1]);
            map.put("voix", row[2]);
            structuredResults.add(map);
        }
        return structuredResults;
    }

    public java.util.List<java.util.Map<String, Object>> getClassementGeneral() {
        java.util.List<Object[]> results = voteRepository.countGlobalVotes();
        java.util.List<java.util.Map<String, Object>> structuredResults = new java.util.ArrayList<>();

        for (Object[] row : results) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("parti", row[0]);
            map.put("voix", row[1]);
            structuredResults.add(map);
        }
        return structuredResults;
    }
}
