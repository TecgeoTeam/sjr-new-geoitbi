package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadeRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Unidade;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemUnidadeRepository;

@Component
public class DAOUnidade {

	@Autowired
	private IOrigemUnidadeRepository unidadeOrigemRepository;
	
	@Autowired
	private IDestinoUnidadeRepository unidadeDestinoRepository;
	
	
	public List<Unidade> getDadosOrigem() {
		/*
		 * RETORNAR P/ TODOS ==> .findAll(); 
		 */
		return unidadeOrigemRepository.findTop100(); 
	}
	
}
