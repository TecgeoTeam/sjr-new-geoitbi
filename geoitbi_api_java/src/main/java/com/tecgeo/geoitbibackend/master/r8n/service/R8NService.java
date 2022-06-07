package com.tecgeo.geoitbibackend.master.r8n.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.master.r8n.model.R8N;
import com.tecgeo.geoitbibackend.master.r8n.repository.IR8NRepository;

@Service
public class R8NService {

	@Autowired
	IR8NRepository r8nRepository;
	
	public List<R8N> getR8N() {
		return r8nRepository.findAll();
	}
	
	public R8N create(R8N r8n) {
		return r8nRepository.save(r8n);
	}

}
