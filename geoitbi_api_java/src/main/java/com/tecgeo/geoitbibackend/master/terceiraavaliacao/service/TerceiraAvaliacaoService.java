package com.tecgeo.geoitbibackend.master.terceiraavaliacao.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.master.terceiraavaliacao.model.TerceiraAvaliacao;
import com.tecgeo.geoitbibackend.master.terceiraavaliacao.repository.ITerceiraAvaliacaoRepository;

@Service
public class TerceiraAvaliacaoService {

	@Autowired
	private ITerceiraAvaliacaoRepository terceiraAvaliacaoRepository;
	
	public TerceiraAvaliacao create(TerceiraAvaliacao terceiraAvaliacao) {
		System.out.println(terceiraAvaliacao.getValorEdificacao());
		System.out.println(terceiraAvaliacao.getValorAvaliacao());
//		terceiraAvaliacao.calcularValorMinimoTotal();
//		terceiraAvaliacao.calcularValorMedioTotal();
//		terceiraAvaliacao.calcularValorMaximoTotal();
		return terceiraAvaliacaoRepository.save(terceiraAvaliacao);
	}

	public List<TerceiraAvaliacao> getAllByGeocode(String geocode) {
		return terceiraAvaliacaoRepository.findByGeocodigo(geocode);
	}

	public TerceiraAvaliacao getLatestByGeocode(String geocode) {
		return terceiraAvaliacaoRepository
				.findFirstByGeocodigoOrderByDataCadastroDesc(geocode);
	}
}
