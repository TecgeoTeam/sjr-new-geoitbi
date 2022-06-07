package com.tecgeo.geoitbibackend.master.transmissao.strategy;

import java.util.List;

import com.tecgeo.geoitbibackend.master.transmissao.service.FiltroCamposUnidade;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;

public interface IConsultaStrategy {
	
	public List<UnidadeDestino> consultarDados(FiltroCamposUnidade filtro, String inscricao);
}
