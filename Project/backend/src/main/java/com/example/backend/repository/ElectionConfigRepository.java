package com.example.backend.repository;

import com.example.backend.model.ElectionConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElectionConfigRepository extends JpaRepository<ElectionConfig, Long> {
}
