package com.tecgeo.geoitbibackend.master.transmissao.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.master.transmissao.strategy.FactoryConsultaStrategy;
import com.tecgeo.geoitbibackend.master.transmissao.util.DAOUtilUnidades;
import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoTransmissaoRepository;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadesPropRepository;

@Service
public class UnidadeService {
	private JSONArray whereUnidade;
	static final String COLUNA_KEY 			= "column";
	static final String VALOR_KEY 			= "value";
	static final String AREA_CONSTRUIDA 	= "area";
	static final String CONSERVACAO 		= "conservacao";
	static final String GEOCODE_STM 		= "geocodeStm";
	static final String IDADE 				= "idade";
	static final String PADRAO_CONSTRUCAO 	= "padraoConstrucao";
	static final String PAVIMENTOS 			= "pavimentos";
	static final String TIPO_IMOVEL 		= "tipoImovel";
	static final String TIPOLOGIA 			= "tipologia";
	
	@Autowired
	private FactoryConsultaStrategy factoryConsulta;
	
	@Autowired
	private IDestinoUnidadesPropRepository unidadesRepository;
	
	private DAOUtilUnidades daoUtils;
	
	public void setWhereUnidade(JSONArray whereString) {
		this.whereUnidade = whereString;
		daoUtils = new DAOUtilUnidades();
	}
	
	public List<UnidadeDestino> executarWhereUnidade(List<TransmissaoDestino> transmissoes) throws ParseException {
		List<UnidadeDestino> resultadoIgual = new ArrayList<>();
		
		List<UnidadeDestino> elegiveis = joinUnidadesTransmissoes(transmissoes);
		
		for (UnidadeDestino u : elegiveis) {
			FiltroCamposUnidade filtroUnidadeIgual = atribuirFiltros("=");
			FiltroCamposUnidade filtroUnidadeDiferente = atribuirFiltros("<>");
			FiltroCamposUnidade filtroUnidadeMaior = atribuirFiltros(">");
			FiltroCamposUnidade filtroUnidadeMenor = atribuirFiltros("<");
			FiltroCamposUnidade filtroUnidadeMenorIgual = atribuirFiltros("<=");
			FiltroCamposUnidade filtroUnidadeMaiorIgual = atribuirFiltros(">=");
	
			List<UnidadeDestino> resultadoParcial = realizarConsultasPorFiltro(filtroUnidadeIgual, u.getGeocodeLote());
			resultadoParcial.addAll(realizarConsultasPorFiltro(filtroUnidadeDiferente, u.getGeocodeLote()));
			resultadoParcial.addAll(realizarConsultasPorFiltro(filtroUnidadeMaior, u.getGeocodeLote()));
			resultadoParcial.addAll(realizarConsultasPorFiltro(filtroUnidadeMenor, u.getGeocodeLote()));
			resultadoParcial.addAll(realizarConsultasPorFiltro(filtroUnidadeMenorIgual, u.getGeocodeLote()));
			resultadoParcial.addAll(realizarConsultasPorFiltro(filtroUnidadeMaiorIgual, u.getGeocodeLote()));

			resultadoIgual.addAll(daoUtils.executarDistinct(resultadoParcial));
		}
		
		return resultadoIgual;
	}
	
	public List<UnidadeDestino> joinUnidadesTransmissoes(List<TransmissaoDestino> transmissoes) {
		return unidadesRepository.findByGeocodeLoteIn(getInscricoesTransmissao(transmissoes));
	}
	
	public List<String> getInscricoesTransmissao(List<TransmissaoDestino> transmissoes) {
		List<String> inscricoes = new ArrayList<>();
		for (TransmissaoDestino transmissao : transmissoes) {
			if (transmissao.getStgGeocode() != null)
				inscricoes.add(transmissao.getStgGeocode());
		}
		return inscricoes;
	}
	
	public List<UnidadeDestino> verificarExistenciaDeUnidades(List<String> inscricoes) {
		List<UnidadeDestino> list = new ArrayList<>();
		for(String inscricao : inscricoes) {
			Optional<UnidadeDestino> u = unidadesRepository.findByGeocodeLote(inscricao);
			if (u.isPresent()) {
				list.add(u.get());
			}
		}
		return list;
	}
	
	public List<UnidadeDestino> realizarConsultasPorFiltro(FiltroCamposUnidade filtro, String inscricao) {
		List<UnidadeDestino> resultadoConsulta = factoryConsulta.create(AREA_CONSTRUIDA).consultarDados(filtro, inscricao);
		resultadoConsulta.addAll(factoryConsulta.create(CONSERVACAO).consultarDados(filtro, inscricao));
		resultadoConsulta.addAll(factoryConsulta.create(GEOCODE_STM).consultarDados(filtro, inscricao));
		resultadoConsulta.addAll(factoryConsulta.create(IDADE).consultarDados(filtro, inscricao));
		resultadoConsulta.addAll(factoryConsulta.create(PADRAO_CONSTRUCAO).consultarDados(filtro, inscricao));
		resultadoConsulta.addAll(factoryConsulta.create(TIPO_IMOVEL).consultarDados(filtro, inscricao));
		resultadoConsulta.addAll(factoryConsulta.create(TIPOLOGIA).consultarDados(filtro, inscricao));
		return resultadoConsulta;
	}
	
	public FiltroCamposUnidade atribuirFiltros(String operador) {
		FiltroCamposUnidade filtroUnidade = new FiltroCamposUnidade();

		for (int i = 0; i < whereUnidade.length(); i++) {
			JSONObject aux = (JSONObject) this.whereUnidade.get(i);
			if (aux.get("operator").equals(operador)) {
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_GEOCODE_LOTE"))
					filtroUnidade.setGeocodeStm((String) aux.get(VALOR_KEY));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_TIPO_IMOVEL"))
					filtroUnidade.setTipoImovel((String) aux.get(VALOR_KEY));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_TIPOLOGIA"))
					filtroUnidade.setTipologia((String) aux.get(VALOR_KEY));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_PADRAO_CONSTRUCAO"))
					filtroUnidade.setPadraoConstrucao((String) aux.get(VALOR_KEY));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_IDADE"))
					filtroUnidade.setIdade((String) aux.get(VALOR_KEY));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("NU_AREA_CONSTRUIDA"))
					filtroUnidade.setAreaConstruida((BigDecimal) BigDecimal.valueOf(aux.getDouble((VALOR_KEY))));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_CONSERVACAO"))
					filtroUnidade.setConservacao((String) aux.get(VALOR_KEY));
				
				if (((String) aux.get(COLUNA_KEY)).equalsIgnoreCase("DE_PAVIMENTOS"))
					filtroUnidade.setPavimentos((String) aux.get(VALOR_KEY));
			}
		}
		filtroUnidade.setOperador(operador);
		return filtroUnidade;
	}
}
