package com.tecgeo.geoitbibackend.migracao.origem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.origem.model.Transmissao;

@Repository
public interface IOrigemTransmissaoRepository extends JpaRepository<Transmissao, Integer> {
	
	@Query(value = "SELECT * FROM ("
			+ "SELECT row_number() OVER (ORDER BY OBJECTID ASC) AS row_number, *"  
			+ " FROM dbo.TB_TRANSMISSAO) c" 
			+ " WHERE row_number BETWEEN 0 AND 1000", nativeQuery = true)
	List<Transmissao> findTop100();
	
	@Query(value = "SELECT * FROM dbo.TB_TRANSMISSAO T "
			+ " WHERE SUBSTRING(T.DE_INSCRICAO, 3, 9) = ?1", nativeQuery = true)
	List<Transmissao> findByGeocode(String geocode);
}
