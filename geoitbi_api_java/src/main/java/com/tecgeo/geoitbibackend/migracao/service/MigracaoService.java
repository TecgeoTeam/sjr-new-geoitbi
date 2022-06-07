package com.tecgeo.geoitbibackend.migracao.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.log.model.Log;
import com.tecgeo.geoitbibackend.log.service.LogService;
import com.tecgeo.geoitbibackend.migracao.strategy.IETLStrategy;
import com.tecgeo.geoitbibackend.util.StringFile;

@Service
public class MigracaoService {

	@Autowired
	private LogService logService;

	@Autowired
	private FactoryETLService factETL; 

	public void iniciarMigracao() {
		logService.registrarLog(
				new Log("Migracao iniciada", "sjr_prefeitura", "Rotina", "0"));

		long tempInicial = System.currentTimeMillis();

		//this.migrar(StringFile.BAIRRO.get());
		//this.migrar(StringFile.LOTE.get());
		//this.migrar(StringFile.LOTEGEO.get());
		this.migrar(StringFile.ADQUIRENTE.get());
		//this.migrar(StringFile.PROPRIETARIO.get());
		//this.migrar(StringFile.LOGRADOURO.get());
		//this.migrar(StringFile.FACE.get());
		this.migrar(StringFile.TRANSMISSAO.get());
		//this.migrar(StringFile.CADASTRO.get());

		long tempFinal = System.currentTimeMillis();
		String duracao = msToHourSecond((int)(tempFinal - tempInicial));
		
		logService.registrarLog(
				new Log("Migracao finalizada. Duracao: "+duracao, "sjr_cadastro", "Rotina", "0"));
				
	}

	public String msToHourSecond(int ms) {
		Calendar c = Calendar.getInstance();
		c.set(Calendar.HOUR, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		c.add(Calendar.MILLISECOND, ms);
		return new SimpleDateFormat("HH:mm:ss").format(c.getTime());
	}

	public void migrar(String entityName) {
		IETLStrategy etlEntity = factETL.factoryMigracao(entityName);

		try {	
			etlEntity.extrairDados();
			etlEntity.processarDados();
			etlEntity.carregarDados();
		} catch(Exception e) {		
			logService.registrarLog(
					new Log("Erro na migracao", entityName, "Erro", "0"));
		}
	}

}
