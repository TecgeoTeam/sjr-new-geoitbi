package com.tecgeo.geoitbibackend.migracao.strategy;

public interface IETLStrategy {
		
	public void extrairDados();
	
	public void processarDados();
	
	public void carregarDados();
}
