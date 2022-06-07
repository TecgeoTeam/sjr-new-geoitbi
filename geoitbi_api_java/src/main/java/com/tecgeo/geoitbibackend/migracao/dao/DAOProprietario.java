package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.ProprietarioDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.IProprietarioDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.ProprietarioDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoProprietarioRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Proprietario;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemProprietarioRepository;

@Component
public class DAOProprietario {
	@Autowired
	private IOrigemProprietarioRepository proprietarioOrigemRepository;
	
	@Autowired
	private IDestinoProprietarioRepository proprietarioDestinoRepository;
	
	@Autowired
	private IProprietarioDSARepository proprietarioDSARepository;
	
	public List<Proprietario> getDadosOrigem() {
		/*
		 * RETORNAR P/ TODOS ==> .findAll(); 
		 */
		return proprietarioOrigemRepository.findTop100();
	}
	
	public void saveOrUpdate(ProprietarioDestino proprietario) {
		proprietarioDestinoRepository.save(proprietario);
	}
	
	public void saveDSA(ProprietarioDSA proprietario) {
		proprietarioDSARepository.save(proprietario);
	}
	
	public void limparDSA() {
		proprietarioDSARepository.deleteAllInBatch();
	}

}
