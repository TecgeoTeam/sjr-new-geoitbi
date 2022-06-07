package com.tecgeo.geoitbibackend.migracao.destino.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.BairroDestino;

@Repository
public interface IDestinoBairroRepository extends JpaRepository<BairroDestino, Integer> {
	public Optional<BairroDestino> findByCodigoBairro(int codigoBairro);

}
