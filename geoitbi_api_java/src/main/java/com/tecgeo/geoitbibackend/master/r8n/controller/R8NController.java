package com.tecgeo.geoitbibackend.master.r8n.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecgeo.geoitbibackend.master.r8n.model.R8N;
import com.tecgeo.geoitbibackend.master.r8n.repository.IR8NRepository;
import com.tecgeo.geoitbibackend.master.r8n.service.R8NService;

@RestController
@RequestMapping("/r8n")
@SuppressWarnings({"rawtypes","unchecked"})
public class R8NController {
	
	@Autowired
	R8NService r8nService;
	
	@Autowired
	IR8NRepository r8nRepository;

	@GetMapping
	public ResponseEntity getR8N() {
		
		List<R8N> resultado = r8nService.getR8N();
		
		if(resultado.isEmpty()) {
			R8N r8n = new R8N("R8N", 1194.84, "valor do r8n", null, 1, 2018);	
			r8nRepository.save(Arrays.asList(r8n));
			return new ResponseEntity(new ArrayList<>(), HttpStatus.OK);
		} else {
			return new ResponseEntity(resultado, HttpStatus.OK);
		}
	}
	
	@PostMapping()
	public ResponseEntity create(@Valid @RequestBody R8N r8n) {
		return new ResponseEntity(r8nService
				.create(r8n), HttpStatus.CREATED); 
	}
	
}
