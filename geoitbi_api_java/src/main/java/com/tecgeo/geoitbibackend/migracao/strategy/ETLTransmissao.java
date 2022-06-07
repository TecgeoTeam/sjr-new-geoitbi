package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.TransmissaoDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOTransmissao;
import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.origem.model.Transmissao;

public class ETLTransmissao implements IETLStrategy {
	private List<Transmissao> transmissoesOrigem;
	private List<TransmissaoDestino> transmissoesDestino = new ArrayList<>();
	
	private DAOTransmissao dao;
	
	public ETLTransmissao(DAOTransmissao dao) {
		this.dao = dao;
	}
	
	@Override
	public void extrairDados() {
		this.transmissoesOrigem = dao.getDadosOrigem(); 	
	}

	@Override
	public void processarDados() {
		if (!this.transmissoesOrigem.isEmpty()) {
			dao.limparDSA();
			
			for(Transmissao transmissao : this.transmissoesOrigem) {				
				TransmissaoDestino transmissaoToSave = new TransmissaoDestino();
				
//				transmissaoToSave.setObjectId(transmissao.getObjectId());
//				transmissaoToSave.setAliquota(transmissao.getAliquota());
//				transmissaoToSave.setCodigoImovel(transmissao.getCodigoImovel());
//				transmissaoToSave.setCodigoVendedor(transmissao.getCodigoVendedor());
//				transmissaoToSave.setDataVencimento(transmissao.getDataVencimento());
//				transmissaoToSave.setEndereco(transmissao.getEndereco());
//				transmissaoToSave.setExercicio(transmissao.getExercicio());
//				transmissaoToSave.setId(transmissao.getId());
//				transmissaoToSave.setInscricao(transmissao.getInscricao());
//				transmissaoToSave.setNumero(transmissao.getNumero());
//				transmissaoToSave.setValorItbi(transmissao.getValorItbi());
//				transmissaoToSave.setValorVenda(transmissao.getValorVenda());
//				transmissaoToSave.setVendedor(transmissao.getVendedor());
//				transmissaoToSave.setVve(transmissao.getVve());
//				transmissaoToSave.setVvi(transmissao.getVvi());
//				transmissaoToSave.setVvt(transmissao.getVvt());
				
				dao.saveDSA(new TransmissaoDSA(transmissaoToSave));
				
				this.transmissoesDestino.add(transmissaoToSave);
			}
		}
	}

	@Override
	public void carregarDados() {
		for(TransmissaoDestino transmissao : this.transmissoesDestino) {
			dao.saveOrUpdate(transmissao);
		}
	}

}
