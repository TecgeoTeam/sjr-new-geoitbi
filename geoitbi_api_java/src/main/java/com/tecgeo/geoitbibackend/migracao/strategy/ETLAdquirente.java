package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.AdquirenteDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOAdquirente;
import com.tecgeo.geoitbibackend.migracao.destino.model.AdquirenteDestino;
import com.tecgeo.geoitbibackend.migracao.origem.model.Adquirente;

public class ETLAdquirente implements IETLStrategy {
	private List<Adquirente> adquirentesOrigem;
	private List<AdquirenteDestino> adquirentesDestino = new ArrayList<>();
	
	private DAOAdquirente dao;
	
	public ETLAdquirente(DAOAdquirente dao) {
		this.dao = dao;
	}
	
	@Override
	public void extrairDados() {
		this.adquirentesOrigem = dao.getDadosOrigem(); 	
	}

	@Override
	public void processarDados() {
		if (!this.adquirentesOrigem.isEmpty()) {
			dao.limparDSA();
			
			for(Adquirente adquirente : this.adquirentesOrigem) {				
				AdquirenteDestino adquirenteToSave = new AdquirenteDestino();
				
				adquirenteToSave.setObjectId(adquirente.getObjectId());
				adquirenteToSave.setAliquotaItbi(adquirente.getAliquotaItbi());
				adquirenteToSave.setCpfCnpj(adquirente.getCpfCnpj());
				adquirenteToSave.setDataSolicitacao(adquirente.getDataSolicitacao());
				adquirenteToSave.setDataUltimaAtualizacaoMig(new Date());
				adquirenteToSave.setEmiteGuiaIss(adquirente.getEmiteGuiaIss());
				adquirenteToSave.setEmiteGuiaItbi(adquirente.getEmiteGuiaItbi());
				adquirenteToSave.setIdCtacte(adquirente.getIdCtacte());
				adquirenteToSave.setIdDocApagar(adquirente.getIdDocApagar());
				adquirenteToSave.setIdImovel(adquirente.getIdImovel());
				adquirenteToSave.setIdMunicipio(adquirente.getIdMunicipio());
				adquirenteToSave.setIdOld(adquirente.getIdOld());
				adquirenteToSave.setIdPessoa(adquirente.getIdPessoa());
				adquirenteToSave.setIdPessoaSacado(adquirente.getIdPessoaSacado());
				adquirenteToSave.setIdQrCode(adquirente.getIdQrCode());
				adquirenteToSave.setIdTransmissao(adquirente.getIdTransmissao());
				adquirenteToSave.setIdUnidadeCartorio(adquirente.getIdUnidadeCartorio());
				adquirenteToSave.setIdUsuarioSolicitacao(adquirente.getIdUsuarioSolicitacao());
				adquirenteToSave.setIncidelaudemio(adquirente.getIncidelaudemio());
				adquirenteToSave.setMigrado(adquirente.getMigrado());
				adquirenteToSave.setNaturezaTransmissao(adquirente.getNaturezaTransmissao());
				adquirenteToSave.setNomePessoa(adquirente.getNomePessoa());
				adquirenteToSave.setObservacao(adquirente.getObservacao());
				adquirenteToSave.setParcelada(adquirente.getParcelada());
				adquirenteToSave.setPercentualRecebido(adquirente.getPercentualRecebido());
				adquirenteToSave.setPossuiCorretagem(adquirente.getPossuiCorretagem());
				adquirenteToSave.setPossuiFinanciamento(adquirente.getPossuiFinanciamento());
				adquirenteToSave.setPrimeiraTransmissao(adquirente.getPrimeiraTransmissao());
				adquirenteToSave.setProtocolo(adquirente.getProtocolo());
				adquirenteToSave.setSituacao(adquirente.getSituacao());
				adquirenteToSave.setTerceiraAvaliacao(adquirente.getTerceiraAvaliacao());
				adquirenteToSave.setValorBase(adquirente.getValorBase());
				adquirenteToSave.setValorBaseUtilizado(adquirente.getValorBaseUtilizado());
				adquirenteToSave.setValorItbi(adquirente.getValorItbi());
				adquirenteToSave.setValorTransacao(adquirente.getValorTransacao());
				adquirenteToSave.setValorVenal(adquirente.getValorVenal());
				adquirenteToSave.setValorVenalEdificacao(adquirente.getValorVenalEdificacao());
				adquirenteToSave.setValorVenalTerreno(adquirente.getValorVenalTerreno());
				
				dao.saveDSA(new AdquirenteDSA(adquirenteToSave));

				this.adquirentesDestino.add(adquirenteToSave);
			}
		}
	}

	@Override
	public void carregarDados() {
		for(AdquirenteDestino adquirente : this.adquirentesDestino) {
			dao.saveOrUpdate(adquirente);
		}
	}

}
