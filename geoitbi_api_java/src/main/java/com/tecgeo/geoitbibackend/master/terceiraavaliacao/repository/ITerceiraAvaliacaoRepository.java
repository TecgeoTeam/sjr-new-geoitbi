package com.tecgeo.geoitbibackend.master.terceiraavaliacao.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.master.terceiraavaliacao.model.TerceiraAvaliacao;

@Repository
public interface ITerceiraAvaliacaoRepository extends JpaRepository<TerceiraAvaliacao, Long> {
	public List<TerceiraAvaliacao> findByGeocodigo(String geocodigo);
	
	public TerceiraAvaliacao findFirstByGeocodigoOrderByDataCadastroDesc(String geocodigo);
}

