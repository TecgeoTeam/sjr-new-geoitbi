package com.tecgeo.geoitbibackend.migracao.destino.repository;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;

@Repository
public interface IDestinoTransmissaoRepository extends JpaRepository<TransmissaoDestino, Integer> {
	
	@Query(value="SELECT T.* FROM "
			+ "[sjr_cadastro].[sde].[TB_UNIDADES_PROP] U JOIN "
			+ "[sjr_cadastro].[sde].[TB_TRANSMISSOES] T "
			+ "ON (U.DE_GEOCODE_LOTE = T.STG_GEOCODE)"
			+ "WHERE CONVERT(date,T.dt_vencimento, 103) BETWEEN ?1 AND ?2", nativeQuery = true)
	public List<TransmissaoDestino> findFiltrosTransmissao(String dataInicio, String dataFim);

	public List<TransmissaoDestino> findByInscricaoIn(Collection<String> inscricoes);

}
