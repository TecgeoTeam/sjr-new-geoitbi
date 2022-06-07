package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.LogradouroDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.ILogradouroDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.LogradouroDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoLogradouroRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Logradouro;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemLogradouroRepository;

@Component
public class DAOLogradouro {

	@Autowired
	private IOrigemLogradouroRepository logradouroOrigemRepository;
	
	@Autowired
	private IDestinoLogradouroRepository logradouroDestinoRepository;
	
	@Autowired
	private ILogradouroDSARepository logradouroDSARepository;
	
	public List<Logradouro> getDadosOrigem() {
		/*
		 * RETORNAR P/ TODOS ==> .findAll(); 
		 */
		return logradouroOrigemRepository.findTop100(); 
	}
	
	public void saveOrUpdate(LogradouroDestino Logradouro) {
		logradouroDestinoRepository.save(Logradouro);
	}
	
	public void saveDSA(LogradouroDSA Logradouro) {
		logradouroDSARepository.save(Logradouro);
	}
	
	public void limparDSA() {
		logradouroDSARepository.deleteAllInBatch();
	}
}
