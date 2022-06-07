package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.AdquirenteDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.IAdquirenteDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.AdquirenteDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoAdquirenteRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Adquirente;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemAdquirenteRepository;

@Component
public class DAOAdquirente {

	@Autowired
	private IOrigemAdquirenteRepository adquirenteOrigemRepository;
	
	@Autowired
	private IDestinoAdquirenteRepository adquirenteDestinoRepository;
	
	@Autowired
	private IAdquirenteDSARepository adquirenteDSARepository;
	
	public List<Adquirente> getDadosOrigem() {
		/*
		 * RETORNAR P/ TODOS ==> .findAll(); 
		 */
		return adquirenteOrigemRepository.findTop100(); 
	}
	
	public void saveOrUpdate(AdquirenteDestino adquirente) {
		adquirenteDestinoRepository.save(adquirente);
	}
	
	public void saveDSA(AdquirenteDSA adquirente) {
		adquirenteDSARepository.save(adquirente);
	}
	
	public void limparDSA() {
		adquirenteDSARepository.deleteAllInBatch();
	}
}
