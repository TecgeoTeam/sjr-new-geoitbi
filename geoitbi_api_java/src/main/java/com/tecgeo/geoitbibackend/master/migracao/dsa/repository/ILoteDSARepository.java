package com.tecgeo.geoitbibackend.master.migracao.dsa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.BairroDSA;
import com.tecgeo.geoitbibackend.master.migracao.dsa.model.LoteDSA;

@Repository
public interface ILoteDSARepository extends JpaRepository<LoteDSA, Integer> {

}
