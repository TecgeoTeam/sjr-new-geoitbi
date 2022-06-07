package com.tecgeo.geoitbibackend.master.migracao.dsa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.TransmissaoDSA;

@Repository
public interface ITransmissaoDSARepository extends JpaRepository<TransmissaoDSA, Integer> {

}
