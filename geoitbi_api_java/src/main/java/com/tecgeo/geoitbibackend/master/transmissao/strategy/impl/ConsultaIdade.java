package com.tecgeo.geoitbibackend.master.transmissao.strategy.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.tecgeo.geoitbibackend.master.transmissao.service.FiltroCamposUnidade;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.IConsultaStrategy;
import com.tecgeo.geoitbibackend.master.transmissao.util.DAOUtilUnidades;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadesPropRepository;

public class ConsultaIdade implements IConsultaStrategy {
	private IDestinoUnidadesPropRepository unidadeRepository;
	private DAOUtilUnidades daoUtils;
	
	public ConsultaIdade(IDestinoUnidadesPropRepository unidadeRepository) {
		super();
		this.unidadeRepository = unidadeRepository;
		daoUtils = new DAOUtilUnidades();
	}
	
	@Override
	public List<UnidadeDestino> consultarDados(FiltroCamposUnidade filtro, String inscricao) {
		List<UnidadeDestino> resultado = new ArrayList<>();
		if (filtro.getIdade() != null) {
			if (filtro.getOperador().equals("=")) {
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndIdadeLike(inscricao, filtro.getIdade()));
			} else if (filtro.getOperador().equals("<>")) {
				resultado.addAll(unidadeRepository.findByGeocodeLoteAndIdadeNotLike(inscricao, filtro.getIdade()));
			} else {
				Optional<UnidadeDestino> parcial = unidadeRepository.findByGeocodeLote(inscricao);
				if (parcial.isPresent() && parcial.get().getIdade() != null) {
					if (this.verificarIdade(filtro, parcial.get())) {
						resultado.add(parcial.get());
					}
				}
			}
		}
		return daoUtils.executarDistinct(resultado);
	}
	
	public Boolean verificarIdade(FiltroCamposUnidade filtro, UnidadeDestino unidade) {
		int idade = Integer.parseInt(unidade.getIdade());
		if (filtro.getOperador().equals(">"))
			return idade > Integer.parseInt(filtro.getIdade());
		else if (filtro.getOperador().equals("<"))
			return idade < Integer.parseInt(filtro.getIdade());
		else if (filtro.getOperador().equals(">="))
			return idade >= Integer.parseInt(filtro.getIdade());
		else if (filtro.getOperador().equals("<="))
			return idade <= Integer.parseInt(filtro.getIdade());
		
		return false;
	}
}
