package com.tecgeo.geoitbibackend.migracao.origem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.origem.model.Face;

@Repository
public interface IOrigemFaceRepository extends JpaRepository<Face, Integer> {
	
	@Query(value = "SELECT * FROM ("
			+ "SELECT row_number() OVER (ORDER BY OBJECTID ASC) AS row_number, *"  
			+ " FROM dbo.TB_FACE_DE_QUADRA) c" 
			+ " WHERE row_number BETWEEN 0 AND 1000", nativeQuery = true)
	List<Face> findTop100();
}
