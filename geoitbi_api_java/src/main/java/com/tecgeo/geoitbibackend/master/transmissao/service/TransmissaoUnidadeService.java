package com.tecgeo.geoitbibackend.master.transmissao.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;

@Service
@SuppressWarnings({"unchecked", "unused"})
public class TransmissaoUnidadeService {
	
	@Autowired
	private TransmissaoService transmissaoService;
	
	@Autowired
	private UnidadeService unidadeService;

	public List<ResponseObjectUnidadesTransmissoes> consultarTransmissoesUnidades(Map<Object, Object> consulta) throws ParseException {
		atribuirDados(consulta);

		List<TransmissaoDestino> transmissoes = transmissaoService.executarWhereTransmissao();
		System.out.println("Quantidade de transmissões: ");
		System.out.println(transmissoes.size());
		
		// FAZENDO UNIDADE PELO FRONTEND
		//List<UnidadeDestino> unidades = unidadeService.executarWhereUnidade(transmissoes);
		//System.out.println("Quantidade de unidades: ");
		//System.out.println(unidades.size());

		//return montarResultado(transmissoes, unidades);
		return montarResultado(transmissoes);
	}
	
	public List<ResponseObjectUnidadesTransmissoes> montarResultado(List<TransmissaoDestino> transmissoes) {
		List<ResponseObjectUnidadesTransmissoes> retorno = new ArrayList<>();
		for (TransmissaoDestino transmissao : transmissoes) {			
			//for (UnidadeDestino unidade : unidades) {
				
				//if (unidade.getGeocodeLote().equals(transmissao.getInscricao())) {
					ResponseObjectUnidadesTransmissoes currentRetorno = new ResponseObjectUnidadesTransmissoes();
					
					currentRetorno.setDt_solicitacao((transmissao.getDataVencimento()));
					currentRetorno.setNu_idtransmissao((transmissao.getId()));
					currentRetorno.setDE_GEOCODE_LOTE((transmissao.getStgGeocode()));
					//currentRetorno.setDe_exercicio(transmissao.getExercicio());
					currentRetorno.setNu_vvt(transmissao.getVvt());
					currentRetorno.setNu_vve(transmissao.getVve());
					currentRetorno.setNu_vvi(transmissao.getVvi());
					currentRetorno.setNU_VALOR_OPERACAO(transmissao.getValorOperacao());
					currentRetorno.setNu_valoritbi(transmissao.getValorItbi());
					
//					currentRetorno.setNU_AREA_CONSTRUIDA((unidade.getAreaConstruida()));
//					currentRetorno.setDE_CONSERVACAO((unidade.getConservacao()));
//					currentRetorno.setDE_GEOCODE_LOTE((unidade.getGeocodeLote()));
//					currentRetorno.setDE_IDADE((unidade.getIdade()));
//					currentRetorno.setDE_PADRAO_CONSTRUCAO((unidade.getPadraoConstrucao()));
//					currentRetorno.setDE_PAVIMENTOS((unidade.getPavimentos()));
//					currentRetorno.setDE_TIPO_IMOVEL((unidade.getTipoImovel()));
//					currentRetorno.setDE_TIPOLOGIA((unidade.getTipologia()));
//					currentRetorno.setDE_PROP_NOME(unidade.getPropNome());
					
					retorno.add(currentRetorno);
				//}
			//}
		}
		return retorno;
	}

	public void atribuirDados(Map<Object, Object> consulta) {
		transmissaoService.setWhereTransmissao(new JSONArray((List<String>) consulta.get("whereTransmissao")));
		//unidadeService.setWhereUnidade(new JSONArray((List<String>) consulta.get("whereUnidade")));
	}

}
