package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.LoteDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.ILoteDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteDestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEODestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEONaoPrioritarioDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoLoteGEONaoPrioritarioRepository;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoLoteGEORepository;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoLoteRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Unidade;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemTransmissaoRepository;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemUnidadeRepository;

@Component
public class DAOLote {
	
	@Autowired
	private IOrigemUnidadeRepository unidadeOrigemRepository;
	
	@Autowired
	private IOrigemTransmissaoRepository transmissaoOrigemRepository;
	
	@Autowired
	private IDestinoLoteGEORepository loteGEORepository;
	
	@Autowired
	private IDestinoLoteGEONaoPrioritarioRepository loteGEONPRepository;
	
	@Autowired
	private IDestinoLoteRepository loteDestinoRepository;
	
	@Autowired
	private ILoteDSARepository loteDSARepository;
	
	public List<LoteGEODestino> getDadosOrigem() {
		return loteGEORepository.findAll();
	}
	
	public List<LoteGEONaoPrioritarioDestino> getDadosOrigemNP() {
		return loteGEONPRepository.findAll();
	}
	
	public Unidade getUnidadesLote(String geocode) {
		List<Unidade> lista = unidadeOrigemRepository
				.findUnidadesListPorGeocode(geocode);
		if (!lista.isEmpty())
			return lista.get(0);
		
		return null;
	}
	
	public List<Unidade> getListaUnidadesLote(String geocode) {
		return unidadeOrigemRepository.findUnidadesListPorGeocode(geocode);
	}
	
	public LoteGEONaoPrioritarioDestino getLoteNPPorGeocode(String geocode) {
		return loteGEONPRepository.findByGeocode(geocode);
	}
	
	public Boolean existeTransmissoesPorGeocode(String geocode) {
		return !transmissaoOrigemRepository.findByGeocode(geocode).isEmpty();
	}

	public void saveOrUpdate(LoteDestino lote) {
		loteDestinoRepository.save(lote);
	}
	
	public void saveLoteGEO(LoteGEODestino lote) {
		loteGEORepository.save(lote);
	}
	
	public void saveLoteGEONaoPrioritario(LoteGEONaoPrioritarioDestino lote) {
		loteGEONPRepository.save(lote);
	}
	
	public void saveDSA(LoteDSA lote) {
		loteDSARepository.save(lote);
	}
	
	public void limparDSA() {
		loteDSARepository.deleteAllInBatch();
	}
}
