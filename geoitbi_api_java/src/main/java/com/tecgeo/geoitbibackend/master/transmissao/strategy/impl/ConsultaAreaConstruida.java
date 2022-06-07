package com.tecgeo.geoitbibackend.master.transmissao.strategy.impl;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.transmissao.service.FiltroCamposUnidade;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.IConsultaStrategy;
import com.tecgeo.geoitbibackend.master.transmissao.util.DAOUtilUnidades;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadesPropRepository;

public class ConsultaAreaConstruida implements IConsultaStrategy {
	private IDestinoUnidadesPropRepository unidadeRepository;
	private DAOUtilUnidades daoUtils;
	
	public ConsultaAreaConstruida(IDestinoUnidadesPropRepository unidadeRepository) {
		super();
		this.unidadeRepository = unidadeRepository;
		daoUtils = new DAOUtilUnidades();
	}

	@Override
	public List<UnidadeDestino> consultarDados(FiltroCamposUnidade filtro, String inscricao) {
		List<UnidadeDestino> resultado = new ArrayList<>();
		if (filtro.getAreaConstruida() != null) {
			if (filtro.getOperador().equals("="))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndAreaConstruida(inscricao, filtro.getAreaConstruida()));
			if (filtro.getOperador().equals("<>"))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndAreaConstruidaNot(inscricao, filtro.getAreaConstruida()));
			if (filtro.getOperador().equals(">"))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndAreaConstruidaGreaterThan(inscricao, filtro.getAreaConstruida()));
			if (filtro.getOperador().equals("<"))
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndAreaConstruidaLessThan(inscricao, filtro.getAreaConstruida()));
		}
		return daoUtils.executarDistinct(resultado);
	}

}
