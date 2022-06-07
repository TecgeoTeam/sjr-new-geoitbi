package com.tecgeo.geoitbibackend.migracao.destino.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEODestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEONaoPrioritarioDestino;

@Repository
public interface IDestinoLoteGEONaoPrioritarioRepository extends JpaRepository<LoteGEONaoPrioritarioDestino, Integer> {
	LoteGEONaoPrioritarioDestino findByGeocode(String geocode);
}
