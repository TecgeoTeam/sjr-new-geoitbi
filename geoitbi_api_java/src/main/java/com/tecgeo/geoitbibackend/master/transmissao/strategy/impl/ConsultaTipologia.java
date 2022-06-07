package com.tecgeo.geoitbibackend.master.transmissao.strategy.impl;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.transmissao.service.FiltroCamposUnidade;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.IConsultaStrategy;
import com.tecgeo.geoitbibackend.master.transmissao.util.DAOUtilUnidades;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadesPropRepository;

public class ConsultaTipologia implements IConsultaStrategy {
	private IDestinoUnidadesPropRepository unidadeRepository;
	private DAOUtilUnidades daoUtils;
	
	public ConsultaTipologia(IDestinoUnidadesPropRepository unidadeRepository) {
		super();
		this.unidadeRepository = unidadeRepository;
		daoUtils = new DAOUtilUnidades();
	}
	
	@Override
	public List<UnidadeDestino> consultarDados(FiltroCamposUnidade filtro, String inscricao) {
		List<UnidadeDestino> resultado = new ArrayList<>();
		if (filtro.getTipologia() != null) {
			if (filtro.getOperador().equals("="))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndTipologiaLike(inscricao, filtro.getTipologia()));
			if (filtro.getOperador().equals("<>"))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndTipologiaNotLike(inscricao, filtro.getTipologia()));
		}
		return daoUtils.executarDistinct(resultado);
	}

}
