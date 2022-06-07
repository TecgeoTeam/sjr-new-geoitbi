package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.BairroDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.IBairroDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.BairroDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoBairroRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Bairro;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemBairroRepository;

@Component
public class DAOBairro {
	@Autowired
	private IOrigemBairroRepository bairroOrigemRepository;
	
	@Autowired
	private IDestinoBairroRepository bairroDestinoRepository;
	
	@Autowired
	private IBairroDSARepository bairroDSARepository;
	
	public List<Bairro> getDadosOrigem() {
		return bairroOrigemRepository.findAll(); 
	}
	
	public void saveOrUpdate(BairroDestino bairro) {
		bairroDestinoRepository.save(bairro);
	}
	
	public void saveDSA(BairroDSA bairro) {
		bairroDSARepository.save(bairro);
	}
	
	public void limparDSA() {
		bairroDSARepository.deleteAllInBatch();
	}

}
