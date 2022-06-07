package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.migracao.dao.DAOLote;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEODestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEONaoPrioritarioDestino;

public class ETLLoteGEO implements IETLStrategy {
	private List<LoteGEODestino> lotesGeometria;
	private List<LoteGEONaoPrioritarioDestino> lotesNPGeometria;
	private List<LoteGEODestino> lotesGEODestino = new ArrayList<>();
	private List<LoteGEONaoPrioritarioDestino> lotesNPGEODestino = new ArrayList<>();


	private DAOLote dao;

	public ETLLoteGEO(DAOLote dao) {
		this.dao = dao;
	}

	@Override
	public void extrairDados() {
		this.lotesGeometria = dao.getDadosOrigem();
		this.lotesNPGeometria = dao.getDadosOrigemNP();
	}

	@Override
	public void processarDados() {
		if (!this.lotesGeometria.isEmpty()) {
			this.processarLotesGEO();
		}

		if (!this.lotesNPGeometria.isEmpty()) {
			this.processarLotesGEONP();
		}
	}

	public void processarLotesGEO() {
		for(LoteGEODestino loteGEO : this.lotesGeometria) {	
			/*List<CadastroBCI> lista = dao.getListaUnidadesLote(loteGEO.getGeocRenu());	
			if (!lista.isEmpty()) {
				loteGEO.setUso(lista.get(0).getTipoImovel());
				loteGEO.setTipologia(lista.get(0).getTipologia());
				loteGEO.setTemComercial("Não");
				loteGEO.setTemTransmissao("Não");
				
				for(CadastroBCI cadastroBCI : lista) {
					if (cadastroBCI.getDestinacao() != null 
							&& cadastroBCI.getDestinacao().equals("87-COMERCIO/SERV")) {
						loteGEO.setTemComercial("Sim");
					}
				}
				
				if (dao.existeTransmissoesPorGeocode(loteGEO.getGeocRenu())) {
					loteGEO.setTemTransmissao("Sim");
				}*/
				
				this.lotesGEODestino.add(loteGEO);							
		}
	}

	public void processarLotesGEONP() {
		for(LoteGEONaoPrioritarioDestino loteNPGEO : this.lotesNPGeometria) {	
			/*CadastroBCI unidade = dao.getUnidadesLote(loteNPGEO.getGeocode());

			if (unidade != null) {
				loteNPGEO.setUso(unidade.getTipoImovel());
				loteNPGEO.setTipologia(unidade.getTipologia());

				this.lotesNPGEODestino.add(loteNPGEO);			
			}*/
		}
	}

	@Override
	public void carregarDados() {
		for(LoteGEODestino lote : this.lotesGEODestino) {
			dao.saveLoteGEO(lote);
		}	

		for(LoteGEONaoPrioritarioDestino loteNP : this.lotesNPGEODestino) {
			dao.saveLoteGEONaoPrioritario(loteNP);
		}	
	}

}
