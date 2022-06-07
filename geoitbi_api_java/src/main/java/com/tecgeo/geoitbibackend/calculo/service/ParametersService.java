package com.tecgeo.geoitbibackend.calculo.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ParametersService {
	
	private String stringParameters = "{\"coeficienteDepreciacao\":{\"2\":{\"otima\":0.99,\"boa\":0.965,\"regular\":0.811,\"precaria\":0.469},\"4\":{\"otima\":0.979,\"boa\":0.955,\"regular\":0.802,\"precaria\":0.464},\"6\":{\"otima\":0.968,\"boa\":0.944,\"regular\":0.793,\"precaria\":0.459},\"8\":{\"otima\":0.957,\"boa\":0.933,\"regular\":0.784,\"precaria\":0.454},\"10\":{\"otima\":0.945,\"boa\":0.921,\"regular\":0.774,\"precaria\":0.448},\"12\":{\"otima\":0.933,\"boa\":0.909,\"regular\":0.764,\"precaria\":0.442},\"14\":{\"otima\":0.92,\"boa\":0.897,\"regular\":0.754,\"precaria\":0.436},\"16\":{\"otima\":0.907,\"boa\":0.884,\"regular\":0.743,\"precaria\":0.43},\"18\":{\"otima\":0.894,\"boa\":0.871,\"regular\":0.732,\"precaria\":0.424},\"20\":{\"otima\":0.88,\"boa\":0.858,\"regular\":0.721,\"precaria\":0.417},\"22\":{\"otima\":0.866,\"boa\":0.844,\"regular\":0.709,\"precaria\":0.41},\"24\":{\"otima\":0.851,\"boa\":0.83,\"regular\":0.697,\"precaria\":0.403},\"26\":{\"otima\":0.836,\"boa\":0.815,\"regular\":0.685,\"precaria\":0.396},\"28\":{\"otima\":0.821,\"boa\":0.8,\"regular\":0.672,\"precaria\":0.389},\"30\":{\"otima\":0.805,\"boa\":0.785,\"regular\":0.659,\"precaria\":0.382},\"32\":{\"otima\":0.789,\"boa\":0.769,\"regular\":0.646,\"precaria\":0.374},\"34\":{\"otima\":0.772,\"boa\":0.753,\"regular\":0.632,\"precaria\":0.366},\"36\":{\"otima\":0.755,\"boa\":0.736,\"regular\":0.619,\"precaria\":0.358},\"38\":{\"otima\":0.738,\"boa\":0.719,\"regular\":0.604,\"precaria\":0.35},\"40\":{\"otima\":0.72,\"boa\":0.702,\"regular\":0.59,\"precaria\":0.341},\"42\":{\"otima\":0.702,\"boa\":0.684,\"regular\":0.575,\"precaria\":0.333},\"44\":{\"otima\":0.683,\"boa\":0.666,\"regular\":0.56,\"precaria\":0.324},\"46\":{\"otima\":0.664,\"boa\":0.647,\"regular\":0.544,\"precaria\":0.315},\"48\":{\"otima\":0.645,\"boa\":0.629,\"regular\":0.528,\"precaria\":0.306},\"50\":{\"otima\":0.625,\"boa\":0.609,\"regular\":0.512,\"precaria\":0.296},\"52\":{\"otima\":0.605,\"boa\":0.59,\"regular\":0.495,\"precaria\":0.287},\"54\":{\"otima\":0.584,\"boa\":0.569,\"regular\":0.478,\"precaria\":0.277},\"56\":{\"otima\":0.563,\"boa\":0.549,\"regular\":0.461,\"precaria\":0.267},\"58\":{\"otima\":0.542,\"boa\":0.528,\"regular\":0.444,\"precaria\":0.257},\"60\":{\"otima\":0.52,\"boa\":0.507,\"regular\":0.426,\"precaria\":0.246},\"62\":{\"otima\":0.498,\"boa\":0.485,\"regular\":0.408,\"precaria\":0.236},\"64\":{\"otima\":0.475,\"boa\":0.463,\"regular\":0.389,\"precaria\":0.225},\"66\":{\"otima\":0.452,\"boa\":0.441,\"regular\":0.37,\"precaria\":0.214},\"68\":{\"otima\":0.429,\"boa\":0.418,\"regular\":0.351,\"precaria\":0.203},\"70\":{\"otima\":0.405,\"boa\":0.395,\"regular\":0.332,\"precaria\":0.192},\"72\":{\"otima\":0.381,\"boa\":0.371,\"regular\":0.312,\"precaria\":0.18},\"74\":{\"otima\":0.356,\"boa\":0.347,\"regular\":0.292,\"precaria\":0.169},\"76\":{\"otima\":0.331,\"boa\":0.323,\"regular\":0.271,\"precaria\":0.157},\"78\":{\"otima\":0.306,\"boa\":0.298,\"regular\":0.25,\"precaria\":0.145},\"80\":{\"otima\":0.28,\"boa\":0.273,\"regular\":0.229,\"precaria\":0.133},\"82\":{\"otima\":0.254,\"boa\":0.247,\"regular\":0.208,\"precaria\":0.12},\"84\":{\"otima\":0.227,\"boa\":0.221,\"regular\":0.186,\"precaria\":0.108},\"86\":{\"otima\":0.2,\"boa\":0.195,\"regular\":0.164,\"precaria\":0.095},\"88\":{\"otima\":0.173,\"boa\":0.168,\"regular\":0.142,\"precaria\":0.082},\"90\":{\"otima\":0.145,\"boa\":0.141,\"regular\":0.119,\"precaria\":0.069},\"92\":{\"otima\":0.117,\"boa\":0.114,\"regular\":0.096,\"precaria\":0.055},\"94\":{\"otima\":0.088,\"boa\":0.086,\"regular\":0.072,\"precaria\":0.042},\"96\":{\"otima\":0.059,\"boa\":0.058,\"regular\":0.048,\"precaria\":0.028},\"98\":{\"otima\":0.03,\"boa\":0.029,\"regular\":0.024,\"precaria\":0.014},\"100\":{\"otima\":0,\"boa\":0,\"regular\":0,\"precaria\":0}},\"cub\":{\"casa\":{\"baixo\":1.1,\"medio\":1.23,\"alto\":1.54},\"comercio com residencia\":{\"baixo\":1.04,\"medio\":1.16,\"alto\":1.26},\"loja/sala/conjunto\":{\"baixo\":1.17,\"medio\":1.31,\"alto\":1.44},\"apartamento\":{\"baixo\":0.96,\"medio\":1,\"alto\":1.28},\"sobrado\":{\"baixo\":0.9,\"medio\":1.1,\"alto\":1.3},\"sobrado colonial\":{\"baixo\":1.05,\"medio\":1.3,\"alto\":1.5},\"telheiro\":{\"madeira\":0.15,\"metalica\":0.2,\"concreto\":0.25},\"galpao\":{\"madeira\":0.3,\"metalica\":0.4,\"concreto\":0.5},\"deposito medio\":{\"metalica\":0.6,\"concreto\":0.7},\"deposito alto\":{\"metalica\":0.8,\"concreto\":1},\"edificacao industrial\":{\"metalica\":1.1,\"concreto\":1.2}}}";
	private String stringFatorCorrecao = "{\"FATOR_CORRECAO\":{\"CASA\":{\"1A\":1.05,\"1B\":1.10,\"1C\":1.20,\"1D\":1.50},\"APARTAMENTO\":{\"2A\":1.05,\"2B\":0.95,\"2C\":1.00,\"2D\":1.25},\"LOJA\":{\"3A\":1.20,\"3B\":1.15,\"3C\":0.95},\"TELHEIRO\":{\"4A\":0.45,\"4B\":0.60,\"4C\":0.85},\"INDÚSTRIA\":{\"4C\":1.20}}}";
	private String stringJsonZona = "{\"ZONEAMENTO\":{\"ZONA CENTRAL\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":140,\"PERCENTUAL\":30},\"ZONA RESIDENCIAL 1\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":10,\"ATME\":180,\"PERCENTUAL\":40},\"ZONA RESIDENCIAL 2\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":10,\"ATME\":360,\"PERCENTUAL\":40},\"ZONA RESIDENCIAL 3\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":180,\"PERCENTUAL\":40},\"ZONA RESIDENCIAL 4\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":18,\"PERCENTUAL\":40},\"ZONA RESIDENCIAL 5\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":120,\"PERCENTUAL\":40},\"ZONA RESIDENCIAL 6\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RESIDENCIAL 7\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA RESIDENCIAL 8\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":120,\"PERCENTUAL\":60},\"ZONA RESIDENCIAL 9\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":140,\"PERCENTUAL\":30},\"ZONA RESIDENCIAL 10\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":140,\"PERCENTUAL\":30},\"ZONA DE DESENVOLVIMENTO SOCIAL 1\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":120,\"PERCENTUAL\":30},\"ZONA DE DESENVOLVIMENTO SOCIAL 2\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":180,\"PERCENTUAL\":30},\"ZONA DE DESENVOLVIMENTO SOCIAL 3\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":210,\"PERCENTUAL\":30},\"ZONA DE DESENVOLVIMENTO SOCIAL 4\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":210,\"PERCENTUAL\":30},\"ZONA DE INTERESSE TURÍSTICO E CULTURAL 1\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":210,\"PERCENTUAL\":30},\"ZONA DE INTERESSE TURÍSTICO E CULTURAL 2\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":210,\"PERCENTUAL\":30},\"ZONA DE INTERESSE TURÍSTICO E CULTURAL 3\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":210,\"PERCENTUAL\":30},\"ZONA INDUSTRIAL DE PRODUÇÃO DE ALIMENTOS 1\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA INDUSTRIAL DE PRODUÇÃO DE ALIMENTOS 2\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA INDUSTRIAL 1\":{\"Area_Minima_Lote\":800,\"Testa_Minima\":20,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA INDUSTRIAL 2\":{\"Area_Minima_Lote\":800,\"Testa_Minima\":20,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA INDUSTRIAL NAVAL 1\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA INDUSTRIAL NAVAL 2\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":100,\"PERCENTUAL\":50},\"ZONA DE ESPANSÃO URBANA\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":180,\"PERCENTUAL\":40},\"ZONA ESPECIAL DE DESENVOLVIMENTO RURAL\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL MIRITIUA/BOA VISTA\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL LARANJAL\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL MATA/SANTANA\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL QUINTA\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL JARARAI\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL DO ITAPARI\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL BOM JARDIM/JUÇATUBA\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60},\"ZONA RURAL GUARAPIRANGA\":{\"Area_Minima_Lote\":150,\"Testa_Minima\":7.5,\"ATME\":80,\"PERCENTUAL\":60}}}";
	
	public Object buildParameters() {
		/*TODO colocar parameters dentro de uma tabela no banco*/
		/*TODO ou ler a partir do arquivo*/

		Map<String, Object> parameters = new HashMap<String, Object>();
		ObjectMapper depMapper = new ObjectMapper();
		
		try {
			parameters = depMapper.readValue(this.stringParameters, new TypeReference<Map<String, Object>>(){});
			return parameters;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public Object buildZona() {
		
		Map<String, Object> parameters = new HashMap<String, Object>();
		ObjectMapper depMapper = new ObjectMapper();
		try {
			parameters = depMapper.readValue(this.stringJsonZona, new TypeReference<Map<String, Object>>(){});
			return parameters;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public Object buildFatorCorrecao() {
		
		Map<String, Object> parameters = new HashMap<String, Object>();
		ObjectMapper depMapper = new ObjectMapper();
		try {
			parameters = depMapper.readValue(this.stringFatorCorrecao, new TypeReference<Map<String, Object>>(){});
			return parameters;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

}
