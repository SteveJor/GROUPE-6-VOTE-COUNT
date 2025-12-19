package com.example.backend.service;

import com.example.backend.model.ElectionConfig;
import com.example.backend.repository.ElectionConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ElectionService {
    @Autowired
    private ElectionConfigRepository electionConfigRepository;

    public void setElectionPeriod(LocalDateTime start, LocalDateTime end) {
        ElectionConfig config = electionConfigRepository.findById(1L).orElse(new ElectionConfig());
        config.setDebutVote(start);
        config.setFinVote(end);
        electionConfigRepository.save(config);
    }

    public boolean isVoteOpen() {
        ElectionConfig config = electionConfigRepository.findById(1L).orElse(null);
        if (config == null || config.getDebutVote() == null || config.getFinVote() == null) {
            return false;
        }
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(config.getDebutVote()) && now.isBefore(config.getFinVote());
    }
}
