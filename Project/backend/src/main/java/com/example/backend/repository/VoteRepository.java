package com.example.backend.repository;

import com.example.backend.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    @Query("SELECT v.electeur.region, v.partiPolitique.nomParti, COUNT(v) as count FROM Vote v GROUP BY v.electeur.region, v.partiPolitique.nomParti ORDER BY v.electeur.region, count DESC")
    List<Object[]> countVotesByRegion();

    @Query("SELECT v.partiPolitique.nomParti, COUNT(v) as count FROM Vote v GROUP BY v.partiPolitique.nomParti ORDER BY count DESC")
    List<Object[]> countGlobalVotes();
}
