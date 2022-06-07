package com.tecgeo.geoitbibackend.migracao.destino.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;
import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;

@Repository
public interface IDestinoUnidadesPropRepository extends JpaRepository<UnidadeDestino, Integer> {
	//TODO TROCAR INSCRIÇÃO ANTERIOR POR GEOCODE LOTE
	
	public Optional<UnidadeDestino> findByGeocodeLote(String inscricao);

	public List<UnidadeDestino> findByGeocodeLoteIn(Collection<String> inscricao);
	
	public List<UnidadeDestino> findByGeocodeLoteAndGeocodeStmLike(String inscricao, String geocodeStm);
	public List<UnidadeDestino> findByGeocodeLoteAndGeocodeStmNotLike(String inscricao, String geocodeStm);
	
	public List<UnidadeDestino> findByGeocodeLoteAndTipoImovelLike(String inscricao, String tipoImovel);
	public List<UnidadeDestino> findByGeocodeLoteAndTipoImovelNotLike(String inscricao, String tipoImovel);
	
	public List<UnidadeDestino> findByGeocodeLoteAndTipologiaLike(String inscricao, String tipologia);
	public List<UnidadeDestino> findByGeocodeLoteAndTipologiaNotLike(String inscricao, String tipologia);
	
	public List<UnidadeDestino> findByGeocodeLoteAndPadraoConstrucaoLike(String inscricao, String padraoConstrucao);
	public List<UnidadeDestino> findByGeocodeLoteAndPadraoConstrucaoNotLike(String inscricao, String padraoConstrucao);
	
	public List<UnidadeDestino> findByGeocodeLoteAndIdadeLike(String inscricao, String idade);
	public List<UnidadeDestino> findByGeocodeLoteAndIdadeNotLike(String inscricao, String idade);
	
	public List<UnidadeDestino> findByGeocodeLoteAndAreaConstruida(String inscricao, BigDecimal areaConstruida);
	public List<UnidadeDestino> findByGeocodeLoteAndAreaConstruidaNot(String inscricao, BigDecimal areaConstruida);
	public List<UnidadeDestino> findByGeocodeLoteAndAreaConstruidaGreaterThan(String inscricao, BigDecimal areaConstruida);
	public List<UnidadeDestino> findByGeocodeLoteAndAreaConstruidaLessThan(String inscricao, BigDecimal areaConstruida);
	
	public List<UnidadeDestino> findByGeocodeLoteAndConservacaoLike(String inscricao, String conservacao);
	public List<UnidadeDestino> findByGeocodeLoteAndConservacaoNotLike(String inscricao, String conservacao);

	public List<UnidadeDestino> findByGeocodeLoteAndPavimentosLike(String inscricao, String pavimentos);
	public List<UnidadeDestino> findByGeocodeLoteAndPavimentosNotLike(String inscricao, String pavimentos);

	@Query(value="SELECT U.* FROM "
			+ "[sjr_cadastro].[sde].[TB_UNIDADES_PROP] U JOIN "
			+ "[sjr_cadastro].[sde].[TB_TRANSMISSOES] T "
			+ "ON (U.DE_GEOCODE_LOTE = T.STG_GEOCODE)", nativeQuery = true)
	public List<UnidadeDestino> getUnidadesJoinTransmissao();
	
}
