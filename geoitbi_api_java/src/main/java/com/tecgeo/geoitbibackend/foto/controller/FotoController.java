package com.tecgeo.geoitbibackend.foto.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecgeo.geoitbibackend.foto.service.FotoService;

@RestController
@RequestMapping("/pesquisa-foto")
@SuppressWarnings({"rawtypes", "unchecked"})
public class FotoController {
	static final String FOTO_KEY = "photoUrl";
	static final String MSG_KEY = "mensagem";
	static final String ERRO_MSG = "Erro ao salvar arquivo: ";
	static final String BAD_REQUEST_MSG = "Problema no envio do arquivo";
	
	@Autowired
	private FotoService fotoService;

	@CrossOrigin(origins = "*")
	@PostMapping()
	public ResponseEntity create(@RequestBody String foto) throws UnsupportedEncodingException {
		Map<String, String> retorno = new HashMap<>();
		String fotoUnescape = java.net.URLDecoder.decode(foto, "UTF-8");

		if (fotoUnescape == null) {
			retorno.put(FOTO_KEY, "");
			retorno.put(MSG_KEY, BAD_REQUEST_MSG);
			return new ResponseEntity(retorno, HttpStatus.BAD_REQUEST);
		}
		
		try {
			retorno.put(FOTO_KEY, fotoService.create(fotoUnescape));
			return new ResponseEntity(retorno, HttpStatus.OK); 
		} catch(Exception e) {
			retorno.put(MSG_KEY, ERRO_MSG + e.getMessage());
			retorno.put(FOTO_KEY, "");			
			return new ResponseEntity(retorno, HttpStatus.INTERNAL_SERVER_ERROR); 
		}

	}
}
