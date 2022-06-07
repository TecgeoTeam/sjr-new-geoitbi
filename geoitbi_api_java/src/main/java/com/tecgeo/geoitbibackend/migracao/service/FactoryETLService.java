package com.tecgeo.geoitbibackend.migracao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.migracao.dao.DAOAdquirente;
import com.tecgeo.geoitbibackend.migracao.dao.DAOBairro;
import com.tecgeo.geoitbibackend.migracao.dao.DAOUnidade;
import com.tecgeo.geoitbibackend.migracao.dao.DAOFace;
import com.tecgeo.geoitbibackend.migracao.dao.DAOLogradouro;
import com.tecgeo.geoitbibackend.migracao.dao.DAOLote;
import com.tecgeo.geoitbibackend.migracao.dao.DAOProprietario;
import com.tecgeo.geoitbibackend.migracao.dao.DAOTransmissao;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLAdquirente;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLBairro;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLFace;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLLogradouro;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLLote;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLLoteGEO;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLProprietario;
import com.tecgeo.geoitbibackend.migracao.strategy.ETLTransmissao;
import com.tecgeo.geoitbibackend.migracao.strategy.IETLStrategy;

@Service
public class FactoryETLService {
	static final String LOTE_FACT 			= "lotes";
	static final String LOTEGEO_FACT 		= "lotes_geo";
	static final String TRASMISSAO_FACT 	= "transmissao";
	static final String ADQUIRENTE_FACT 	= "adquirente";
	static final String BAIRRO_FACT 		= "bairro";
	static final String PROPRIETARIO_FACT 	= "proprietario";
	static final String LOGRADOURO_FACT 	= "logradouro";
	static final String FACE_FACT 			= "face";
	static final String CADASTRO_FACT 		= "cadastro";

	@Autowired
	DAOBairro daoBairro;
	
	@Autowired
	DAOLote daoLote;
	
	@Autowired
	DAOAdquirente daoAdquirente;
	
	@Autowired
	DAOTransmissao daoTransmissao;
	
	@Autowired
	DAOProprietario daoProprietario;
	
	@Autowired
	DAOLogradouro daoLogradouro;
	
	@Autowired
	DAOUnidade daoCadastro;
	
	@Autowired
	DAOFace daoFace;
	
	public IETLStrategy factoryMigracao(String nome) {
		 switch (nome) {
		 
	         case LOTE_FACT: 		
	        	 return new ETLLote(daoLote);
	        	
	         case LOTEGEO_FACT: 		
	        	 return new ETLLoteGEO(daoLote);
	        	 
	         case TRASMISSAO_FACT:  
	        	 return new ETLTransmissao(daoTransmissao);
	        	 
	         case ADQUIRENTE_FACT:	
	        	 return new ETLAdquirente(daoAdquirente);
	        	 
	         case BAIRRO_FACT:		
	        	 return new ETLBairro(daoBairro);
	        	 
	         case PROPRIETARIO_FACT:		
	        	 return new ETLProprietario(daoProprietario);
	        	 
	         case LOGRADOURO_FACT:		
	        	 return new ETLLogradouro(daoLogradouro);
	        	 
	         case FACE_FACT:		
	        	 return new ETLFace(daoFace);
	        	 
	         case CADASTRO_FACT:		
	        	 //return new ETLCadastroBCI(daoCadastro);
	        	 
	         default:				
	        	 return null;
		 }
	}
}
