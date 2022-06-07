package com.tecgeo.geoitbibackend.migracao.origem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.origem.model.Unidade;

@Repository
public interface IOrigemUnidadeRepository extends JpaRepository<Unidade, Integer> {
	
	@Query(value = "SELECT * FROM ("
			+ "SELECT row_number() OVER (ORDER BY OBJECTID ASC) AS row_number, *"  
			+ " FROM dbo.TB_UNIDADES_PROP) c" 
			+ " WHERE row_number BETWEEN 0 AND 1000", nativeQuery = true)
	List<Unidade> findTop100();
	
	@Query(value = "SELECT * FROM dbo.TB_UNIDADES_PROP B"
			+ " WHERE B.GEOCODE_LOTE = :geocode", nativeQuery = true)
	List<Unidade> findUnidadesListPorGeocode(@Param("geocode") String geocode);
	//TODO: VERIFICAR PARAMETRO (POSSIVEL CAUSA DO ERRO)
	
}
