package com.tecgeo.geoitbibackend.migracao.destino.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.ProprietarioDestino;

@Repository
public interface IDestinoProprietarioRepository extends JpaRepository<ProprietarioDestino, Integer> {

}
