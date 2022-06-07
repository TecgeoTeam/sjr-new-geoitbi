package com.tecgeo.geoitbibackend.util;

public enum StringFile {
	LOTE("lotes"),
	LOTEGEO("lotes_geo"),
	TRANSMISSAO("transmissao"),
	ADQUIRENTE("adquirente"),
	BAIRRO("bairro"),
	PROPRIETARIO("proprietario"),
	LOGRADOURO("logradouro"),
	FACE("face"),
	CADASTRO("cadastro"),
	MIGRACAO_INICIADA("O processo de migração foi iniciado");
    private final String value;
    
    StringFile(String value) {
        this.value = value;
    }
    
    public String get() {
    	return this.value;
    }
}
