package com.tecgeo.geoitbibackend.migracao.destino.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.LoteGEODestino;

@Repository
public interface IDestinoLoteGEORepository extends JpaRepository<LoteGEODestino, Integer> {
	
	@Query(value = "SELECT * FROM ("
			+ "SELECT row_number() OVER (ORDER BY OBJECTID ASC) AS row_number, *"  
			+ " FROM sde.LOTE) c" 
			+ " WHERE row_number BETWEEN 0 AND 1000", nativeQuery = true)
	List<LoteGEODestino> findTop100();
}
