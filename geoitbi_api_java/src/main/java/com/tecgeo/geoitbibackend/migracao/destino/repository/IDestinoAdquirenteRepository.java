package com.tecgeo.geoitbibackend.migracao.destino.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.AdquirenteDestino;

@Repository
public interface IDestinoAdquirenteRepository extends JpaRepository<AdquirenteDestino, Integer> {

}
