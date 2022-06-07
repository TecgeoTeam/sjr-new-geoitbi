package com.tecgeo.geoitbibackend.master.transmissao.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaAreaConstruida;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaConservacao;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaGeocodeSTM;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaIdade;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaPadraoConstrucao;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaPavimentos;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaTipoImovel;
import com.tecgeo.geoitbibackend.master.transmissao.strategy.impl.ConsultaTipologia;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoUnidadesPropRepository;

@Component
public class FactoryConsultaStrategy {
	static final String AREA_CONSTRUIDA 	= "area";
	static final String CONSERVACAO 		= "conservacao";
	static final String GEOCODE_STM		= "geocodeStm";
	static final String IDADE 				= "idade";
	static final String PADRAO_CONSTRUCAO 	= "padraoConstrucao";
	static final String PAVIMENTOS 			= "pavimentos";
	static final String TIPO_IMOVEL 		= "tipoImovel";
	static final String TIPOLOGIA 			= "tipologia";
	
	@Autowired
	private IDestinoUnidadesPropRepository unidadeRepository;
	
	public IConsultaStrategy create(String nome) {
		 switch (nome) {
		 
	         case AREA_CONSTRUIDA: 		
	        	 return new ConsultaAreaConstruida(unidadeRepository);
	        	
	         case CONSERVACAO: 		
	        	 return new ConsultaConservacao(unidadeRepository);
	        	 
	         case GEOCODE_STM:  
	        	 return new ConsultaGeocodeSTM(unidadeRepository);
	        	 
	         case IDADE:	
	        	 return new ConsultaIdade(unidadeRepository);
	        	 
	         case PADRAO_CONSTRUCAO:	
	        	 return new ConsultaPadraoConstrucao(unidadeRepository);
	        	 
	         case PAVIMENTOS:	
	        	 return new ConsultaPavimentos(unidadeRepository);
	        	 
	         case TIPO_IMOVEL:	
	        	 return new ConsultaTipoImovel(unidadeRepository);
	        	 
		     case TIPOLOGIA:	
		    	 return new ConsultaTipologia(unidadeRepository);
		    	 
	         default:				
	        	 return null;
		 }
	}
}
