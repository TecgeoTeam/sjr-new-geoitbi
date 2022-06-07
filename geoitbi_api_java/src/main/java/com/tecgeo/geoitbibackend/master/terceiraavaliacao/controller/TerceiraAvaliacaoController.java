package com.tecgeo.geoitbibackend.master.terceiraavaliacao.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecgeo.geoitbibackend.master.terceiraavaliacao.model.TerceiraAvaliacao;
import com.tecgeo.geoitbibackend.master.terceiraavaliacao.service.TerceiraAvaliacaoService;

@RestController
@RequestMapping("/terceiraavaliacao")
@SuppressWarnings({"rawtypes", "unchecked"})
public class TerceiraAvaliacaoController {

	@Autowired
	private TerceiraAvaliacaoService terceiraAvaliacaoService;
	
	@CrossOrigin(origins = "*")
	@PostMapping()
	public ResponseEntity create(TerceiraAvaliacao terceiraAvaliacao) {
		return new ResponseEntity(terceiraAvaliacaoService
				.create(terceiraAvaliacao), HttpStatus.CREATED); 
	}
	
	@CrossOrigin(origins = "*")
	@GetMapping(value = "/{geocode}")
	public ResponseEntity getAllByGeocode(@PathVariable String geocode) {
		List<TerceiraAvaliacao> resultado = terceiraAvaliacaoService
				.getAllByGeocode(geocode);
		if (resultado.isEmpty())
			return new ResponseEntity(new ArrayList<>(), HttpStatus.OK);
		else
			return new ResponseEntity(resultado, HttpStatus.OK);
	}
	
	@CrossOrigin(origins = "*")
	@GetMapping(value = "/latest/{geocode}")
	public ResponseEntity getLastByGeocode(@PathVariable String geocode) {
		return new ResponseEntity(terceiraAvaliacaoService
				.getLatestByGeocode(geocode), HttpStatus.OK);
	}
}
