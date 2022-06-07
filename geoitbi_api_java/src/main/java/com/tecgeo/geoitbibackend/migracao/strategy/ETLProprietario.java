package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.ProprietarioDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOProprietario;
import com.tecgeo.geoitbibackend.migracao.destino.model.ProprietarioDestino;
import com.tecgeo.geoitbibackend.migracao.origem.model.Proprietario;

public class ETLProprietario implements IETLStrategy {
	private List<Proprietario> proprietariosOrigem;
	private List<ProprietarioDestino> proprietariosDestino = new ArrayList<>();
	
	private DAOProprietario dao;
	
	public ETLProprietario(DAOProprietario dao) {
		this.dao = dao;
	}
	
	@Override
	public void extrairDados() {
		this.proprietariosOrigem = dao.getDadosOrigem(); 	
	}

	@Override
	public void processarDados() {
		if (!this.proprietariosOrigem.isEmpty()) {
			dao.limparDSA();
			
			for(Proprietario proprietario : this.proprietariosOrigem) {				
				ProprietarioDestino proprietarioToSave = new ProprietarioDestino();
				
				proprietarioToSave.setObjectId(proprietario.getObjectId());
				proprietarioToSave.setAquisicao(proprietario.getAquisicao());
				proprietarioToSave.setBairro(proprietario.getBairro());
				proprietarioToSave.setCep(proprietario.getCep());
				proprietarioToSave.setCidade(proprietario.getCidade());
				proprietarioToSave.setComplemento(proprietario.getComplemento());
				proprietarioToSave.setCpf(proprietario.getCpf());
				proprietarioToSave.setDataMigracao(new Date());
				proprietarioToSave.setEmail(proprietario.getEmail());
				proprietarioToSave.setEndereco(proprietario.getEndereco());
				proprietarioToSave.setFone(proprietario.getFone());
				proprietarioToSave.setNome(proprietario.getNome());
				proprietarioToSave.setNumero(proprietario.getNumero());
				proprietarioToSave.setQuadra(proprietario.getQuadra());
				proprietarioToSave.setUf(proprietario.getUf());
				
				dao.saveDSA(new ProprietarioDSA(proprietarioToSave));
				
				this.proprietariosDestino.add(proprietarioToSave);
			}
		}
	}

	@Override
	public void carregarDados() {
		for(ProprietarioDestino proprietario : this.proprietariosDestino) {
			dao.saveOrUpdate(proprietario);
		}
	}

}
