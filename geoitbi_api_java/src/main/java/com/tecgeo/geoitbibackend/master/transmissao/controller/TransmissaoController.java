package com.tecgeo.geoitbibackend.master.transmissao.controller;

import java.text.ParseException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecgeo.geoitbibackend.master.transmissao.service.TransmissaoUnidadeService;

@RestController
@RequestMapping("/transmissaounidade")
@SuppressWarnings({"rawtypes", "unchecked"})
public class TransmissaoController {
	
	@Autowired
	private TransmissaoUnidadeService transmissaoUnidadeService;
	
	@PostMapping()
	@CrossOrigin(origins = "*")
	public ResponseEntity create(@RequestBody Map<Object, Object> requestObj) {
		try {
			return new ResponseEntity(transmissaoUnidadeService
					.consultarTransmissoesUnidades(requestObj), HttpStatus.OK);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return new ResponseEntity(null, HttpStatus.OK);
	}

}