package com.tecgeo.geoitbibackend.migracao.origem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.origem.model.Bairro;

@Repository
public interface IOrigemBairroRepository extends JpaRepository<Bairro, Integer> {

}
