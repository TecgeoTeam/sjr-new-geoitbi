package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.LoteDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOLote;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteDestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEODestino;

public class ETLLote implements IETLStrategy {
	private List<LoteGEODestino> lotesGeometria;
	private List<LoteDestino> lotesDestino = new ArrayList<>();
	
	private DAOLote dao;
	
	public ETLLote(DAOLote dao) {
		this.dao = dao;
	}
	
	
	@Override
	public void extrairDados() {
		this.lotesGeometria = dao.getDadosOrigem(); 
	}

	@Override
	public void processarDados() {
		if (!this.lotesGeometria.isEmpty()) {
			dao.limparDSA();
			for(LoteGEODestino loteGEO : this.lotesGeometria) {	
				//CadastroBCI unidade = dao.getUnidadesLote(loteGEO.getGeocRenu());
				
				if (true) {
					LoteDestino loteToSave = new LoteDestino();

															
					dao.saveDSA(new LoteDSA(loteToSave));
					
					this.lotesDestino.add(loteToSave);
				}
			}
		}
	}

	@Override
	public void carregarDados() {
		for(LoteDestino lote : this.lotesDestino) {
			dao.saveOrUpdate(lote);
		}
	}

}
