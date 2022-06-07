package com.tecgeo.geoitbibackend.master.r8n.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.master.r8n.model.R8N;

@Repository
public interface IR8NRepository extends JpaRepository<R8N, Integer> {
	
}
