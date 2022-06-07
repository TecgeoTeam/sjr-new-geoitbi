package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.BairroDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOBairro;
import com.tecgeo.geoitbibackend.migracao.destino.model.BairroDestino;
import com.tecgeo.geoitbibackend.migracao.origem.model.Bairro;

public class ETLBairro implements IETLStrategy {
	private List<Bairro> bairrosOrigem;
	private List<BairroDestino> bairrosDestino = new ArrayList<>();
	
	private DAOBairro dao;
	
	public ETLBairro(DAOBairro dao) {
		this.dao = dao;
	}
	
	@Override
	public void extrairDados() {
		this.bairrosOrigem = dao.getDadosOrigem(); 	
	}

	@Override
	public void processarDados() {
		if (!this.bairrosOrigem.isEmpty()) {
			dao.limparDSA();
			
			for(Bairro bairro : this.bairrosOrigem) {				
				BairroDestino bairroToSave = new BairroDestino();
				
				bairroToSave.setObjectId(bairro.getObjectId());
				bairroToSave.setCodigoBairro(bairro.getCodigoBairro());
				bairroToSave.setNomeBairro(bairro.getNomeBairro());
				
				dao.saveDSA(new BairroDSA(bairroToSave));
				
				this.bairrosDestino.add(bairroToSave);
			}
		}
	}

	@Override
	public void carregarDados() {
		for(BairroDestino bairro : this.bairrosDestino) {
			dao.saveOrUpdate(bairro);
		}
	}

}
