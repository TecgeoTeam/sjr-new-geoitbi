package com.tecgeo.geoitbibackend.migracao.destino.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.LoteDestino;

@Repository
public interface IDestinoLoteRepository extends JpaRepository<LoteDestino, Integer> {
	public Optional<LoteDestino> findByObjectId(int objectId);

}
