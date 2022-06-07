package com.tecgeo.geoitbibackend.calculo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecgeo.geoitbibackend.calculo.service.CalculoService;

@RestController
@RequestMapping("/calculo")
public class CalculoController {
	
	@Autowired
	CalculoService calculoService;
	
	@CrossOrigin(origins = "*")
	@GetMapping(value="/{inscricao}")
	public Object calcular(@PathVariable String inscricao) {
		
		return calculoService.calculo(inscricao);
		
	}
	
	@CrossOrigin(origins = "*")
	@GetMapping(value="/simplificado/{inscricao}")
	public Object calcularSimplificado(@PathVariable String inscricao) {
		
		return calculoService.calculoSimplificado(inscricao);
		
	}

}
	

