package com.tecgeo.geoitbibackend.migracao.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecgeo.geoitbibackend.auth.service.AuthService;
import com.tecgeo.geoitbibackend.migracao.service.MigracaoService;
import com.tecgeo.geoitbibackend.util.StringFile;

@RestController
@RequestMapping("/integracao")
@SuppressWarnings({"rawtypes", "unchecked"})
public class MigracaoController {

	@Autowired
	AuthService authService;

	@Autowired
	private MigracaoService migracaoService;

	@GetMapping()
	public ResponseEntity migrarDados() {
		authService.autenticar();

		Map<String, String> map = new HashMap<>();

		new Thread() {
			@Override
			public void run() {
				migracaoService.iniciarMigracao();
			}
		}.start();

		map.put("mensagem", StringFile.MIGRACAO_INICIADA.get());
		return new ResponseEntity(map, HttpStatus.OK);
	}
}
