package com.tecgeo.geoitbibackend.migracao.strategy;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.FaceDSA;
import com.tecgeo.geoitbibackend.migracao.dao.DAOFace;
import com.tecgeo.geoitbibackend.migracao.destino.model.FaceDestino;
import com.tecgeo.geoitbibackend.migracao.origem.model.Face;

public class ETLFace implements IETLStrategy {
	private List<Face> facesOrigem;
	private List<FaceDestino> facesDestino = new ArrayList<>();
	
	private DAOFace dao;
	
	public ETLFace(DAOFace dao) {
		this.dao = dao;
	}
	
	@Override
	public void extrairDados() {
		this.facesOrigem = dao.getDadosOrigem(); 	
	}

	@Override
	public void processarDados() {
		if (!this.facesOrigem.isEmpty()) {
			
			for(Face face : this.facesOrigem) {
				FaceDestino faceToSave = new FaceDestino();
				
				faceToSave.setObjectId(face.getObjectId());
				faceToSave.setAgua(face.getAgua());
				faceToSave.setArborizacao(face.getArborizacao());
				faceToSave.setCalcada(face.getCalcada());
				faceToSave.setCodLog(face.getCodLog());
				faceToSave.setColetaDeLixo(face.getColetaDeLixo());
				faceToSave.setConservacaoDaVia(face.getConservacaoDaVia());
				faceToSave.setDistrito(face.getDistrito());
				faceToSave.setDrenagem(face.getDrenagem());
				faceToSave.setEsgoto(face.getEsgoto());
				faceToSave.setEstacionamento(face.getEstacionamento());
				faceToSave.setFace(face.getFace());
				faceToSave.setHidrante(face.getHidrante());
				faceToSave.setIdFace(face.getIdFace());
				faceToSave.setIluminacao(face.getIluminacao());
				faceToSave.setLimpezaPublica(face.getLimpezaPublica());
				faceToSave.setMeioFio(face.getMeioFio());
				faceToSave.setPavimentacao(face.getPavimentacao());
				faceToSave.setPavimento(face.getPavimento());
				faceToSave.setPontoDeServico(face.getPontoDeServico());
				faceToSave.setQuadra(face.getQuadra());
				faceToSave.setRedeEletrica(face.getRedeEletrica());
				faceToSave.setRedeTelefonica(face.getRedeTelefonica());
				faceToSave.setSentidoLogradouro(face.getSentidoLogradouro());
				faceToSave.setSetor(face.getSetor());
				faceToSave.setTipoVia(face.getTipoVia());
				faceToSave.setTransporte(face.getTransporte());

				dao.saveDSA(new FaceDSA(faceToSave));

				this.facesDestino.add(faceToSave);
			}
		}
	}

	@Override
	public void carregarDados() {
		for(FaceDestino face : this.facesDestino) {
			dao.saveOrUpdate(face);
		}
	}

}
