package com.tecgeo.geoitbibackend.master.transmissao.strategy.impl;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.transmissao.service.FiltroCamposUnidade;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.IConsultaStrategy;
import com.tecgeo.geoitbibackend.master.transmissao.util.DAOUtilUnidades;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadesPropRepository;

public class ConsultaTipoImovel implements IConsultaStrategy {
	private IDestinoUnidadesPropRepository unidadeRepository;
	private DAOUtilUnidades daoUtils;
	
	public ConsultaTipoImovel(IDestinoUnidadesPropRepository unidadeRepository) {
		super();
		this.unidadeRepository = unidadeRepository;
		daoUtils = new DAOUtilUnidades();
	}
	
	@Override
	public List<UnidadeDestino> consultarDados(FiltroCamposUnidade filtro, String inscricao) {
		List<UnidadeDestino> resultado = new ArrayList<>();
		if (filtro.getTipoImovel() != null) {
			if (filtro.getOperador().equals("="))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndTipoImovelLike(inscricao, filtro.getTipoImovel()));
			if (filtro.getOperador().equals("<>"))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndTipoImovelNotLike(inscricao, filtro.getTipoImovel()));
		}
		return daoUtils.executarDistinct(resultado);
	}
}
