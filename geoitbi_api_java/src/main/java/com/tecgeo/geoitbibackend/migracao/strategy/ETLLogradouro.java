package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.LogradouroDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOLogradouro;
import com.tecgeo.geoitbibackend.migracao.destino.model.LogradouroDestino;
import com.tecgeo.geoitbibackend.migracao.origem.model.Logradouro;

public class ETLLogradouro implements IETLStrategy {
	private List<Logradouro> logradourosOrigem;
	private List<LogradouroDestino> logradourosDestino = new ArrayList<>();
	
	private DAOLogradouro dao;
	
	public ETLLogradouro(DAOLogradouro dao) {
		this.dao = dao;
	}
	
	@Override
	public void extrairDados() {
		this.logradourosOrigem = dao.getDadosOrigem(); 	
	}

	@Override
	public void processarDados() {
		if (!this.logradourosOrigem.isEmpty()) {
			
			for(Logradouro logradouro : this.logradourosOrigem) {				
				LogradouroDestino logradouroToSave = new LogradouroDestino();
				
				logradouroToSave.setObjectId(logradouro.getObjectId());
				logradouroToSave.setCep(logradouro.getCep());
				logradouroToSave.setCodLogradouro(logradouro.getCodLogradouro());
				logradouroToSave.setIdBairro(logradouro.getIdBairro());
				logradouroToSave.setIdLogradouroFim(logradouro.getIdLogradouroFim());
				logradouroToSave.setIdLogradouroIni(logradouro.getIdLogradouroIni());
				logradouroToSave.setIdTipoLogradouro(logradouro.getIdTipoLogradouro());
				logradouroToSave.setNomeLogradouro(logradouro.getNomeLogradouro());
				
				dao.saveDSA(new LogradouroDSA(logradouroToSave));

				this.logradourosDestino.add(logradouroToSave);
			}
		}
	}

	@Override
	public void carregarDados() {
		for(LogradouroDestino logradouro : this.logradourosDestino) {
			dao.saveOrUpdate(logradouro);
		}
	}

}
