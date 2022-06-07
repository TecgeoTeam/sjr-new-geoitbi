package com.tecgeo.geoitbibackend.master.migracao.dsa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.master.migracao.dsa.model.LogradouroDSA;

@Repository
public interface ILogradouroDSARepository extends JpaRepository<LogradouroDSA, Integer> {

}
