package com.tecgeo.geoitbibackend.migracao.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.FaceDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.repository.IFaceDSARepository;
import com.tecgeo.geoitbibackend.migracao.destino.model.FaceDestino;
import com.tecgeo.geoitbibackend.migracao.destino.repository.IDestinoFaceRepository;
import com.tecgeo.geoitbibackend.migracao.origem.model.Face;
import com.tecgeo.geoitbibackend.migracao.origem.repository.IOrigemFaceRepository;

@Component
public class DAOFace {
	
	@Autowired
	private IOrigemFaceRepository faceOrigemRepository;
	
	@Autowired
	private IDestinoFaceRepository faceDestinoRepository;
	
	@Autowired
	private IFaceDSARepository faceDSARepository;
	
	public List<Face> getDadosOrigem() {
		/*
		 * RETORNAR P/ TODOS ==> .findAll(); 
		 */
		return faceOrigemRepository.findTop100(); 
	}

	public void saveOrUpdate(FaceDestino face) {
		faceDestinoRepository.save(face);
	}
	
	public void saveDSA(FaceDSA face) {
		faceDSARepository.save(face);
	}
	
	public void limparDSA() {
		faceDSARepository.deleteAllInBatch();
	}
}
