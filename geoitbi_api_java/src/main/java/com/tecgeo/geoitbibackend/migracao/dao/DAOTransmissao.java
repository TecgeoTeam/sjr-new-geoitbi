package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.TransmissaoDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.ITransmissaoDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoTransmissaoRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Transmissao;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemTransmissaoRepository;

@Component
public class DAOTransmissao {
	
	@Autowired
	private IOrigemTransmissaoRepository transmissaoOrigemRepository;
	
	@Autowired
	private IDestinoTransmissaoRepository transmissaoDestinoRepository;
	
	@Autowired
	private ITransmissaoDSARepository transmissaoDSARepository;
	
	public List<Transmissao> getDadosOrigem() {
		/*
		 * RETORNAR P/ TODOS ==> .findAll(); 
		 */
		return transmissaoOrigemRepository.findTop100();
	}
	
	public void saveOrUpdate(TransmissaoDestino transmissao) {
		transmissaoDestinoRepository.save(transmissao);
	}
	
	public void saveDSA(TransmissaoDSA transmissao) {
		transmissaoDSARepository.save(transmissao);
	}
	
	public void limparDSA() {
		transmissaoDSARepository.deleteAllInBatch();
	}

}
