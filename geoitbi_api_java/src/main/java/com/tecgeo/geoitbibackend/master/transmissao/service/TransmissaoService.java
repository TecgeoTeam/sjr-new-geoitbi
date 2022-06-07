package com.tecgeo.geoitbibackend.master.transmissao.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoTransmissaoRepository;

@Service
public class TransmissaoService {
	private JSONArray whereTransmissao;

	@Autowired
	private IDestinoTransmissaoRepository transmissaoRepository;
	
	public void setWhereTransmissao(JSONArray whereString) {
		this.whereTransmissao = whereString;
	}
	
	public List<TransmissaoDestino> executarWhereTransmissao() throws ParseException {
		List<String> inscricoesWhereIn = new ArrayList<>();
		String dataInicio=null;
		String dataFim=null;
		String idTransmissao = null;

		for (int i = 0; i < whereTransmissao.length(); i++) {
			JSONObject aux = (JSONObject) this.whereTransmissao.get(i);
			System.out.println(aux);
			if (aux.get("column").equals("dt_solicitacao")) {
				String[] datas = ((String) aux.get("value")).split("'");
				dataInicio = datas[1];
				System.out.println(dataInicio);
				dataFim = datas[3];

			}

			if (aux.get("column").equals("idtransmissao"))
				idTransmissao = (String) aux.get("value");
				System.out.println(idTransmissao);
			
			if (aux.get("column").equals("de_inscricao")) {
				String objetoWhereInscricoes = (String) aux.get("value");
				inscricoesWhereIn = this.splitInscricoes(objetoWhereInscricoes);
			}
		}
				
		List<TransmissaoDestino> parcial = transmissaoRepository
				.findFiltrosTransmissao(dataInicio, dataFim);
		return executarOperadorInTransmissoes(parcial, inscricoesWhereIn);
	}
	
	public List<String> splitInscricoes(String objetoWhereInscricoes) {
		List<String> resultado = new ArrayList<>();
		String[] splitArray = objetoWhereInscricoes.split(",");
		for (String insc : splitArray) {
			insc = insc.replaceAll("'", "");
			insc = insc.replaceAll("\\s", "");
			resultado.add(insc); 
		}
		return resultado;
	}
	
	public List<TransmissaoDestino> executarOperadorInTransmissoes(List<TransmissaoDestino> parcial, List<String> inscricoesWhereIn) {
		List<TransmissaoDestino> resultadoFinal = new ArrayList<>();

		if (inscricoesWhereIn.isEmpty())
			return parcial;
		
		for (TransmissaoDestino transmissaoEncontrada : parcial) {
			for (String insc : inscricoesWhereIn) { 
				if (transmissaoEncontrada.getStgGeocode().equals(insc)) {
					resultadoFinal.add(transmissaoEncontrada);
				}
			}
		}
		
		return resultadoFinal;
	}
	
	public Date generateDateToWhere(String dataFormato1) {
		String[] dataSplit = dataFormato1.split("-");
		String aux = dataSplit[0];
		dataSplit[0] = dataSplit[2];
		dataSplit[2] = aux;
		String dataFormato2 = String.join("-", dataSplit);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
		try {
			return sdf.parse(dataFormato2 + " 00:00:00");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
}
