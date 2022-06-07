package com.tecgeo.geoitbibackend.master.migracao.dsa.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tecgeo.geoitbibackend.migracao.destino.model.ProprietarioDestino;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="mig.TEMP_SL_CADASTRO_SDE_TB_PROPRIETARIOS")
@SuppressWarnings("serial")
public class ProprietarioDSA implements Serializable {

	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="de_prop_nome", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String nome;
	
	@Column(name="de_prop_cpf", columnDefinition="NVARCHAR(14)")
	@Getter @Setter
	private String cpf;
	
	@Column(name="de_prop_cidade", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String cidade;
	
	@Column(name="de_prop_uf", columnDefinition="NVARCHAR(2)")
	@Getter @Setter
	private String uf;
	
	@Column(name="de_prop_aquisicao", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String aquisicao;
	
	@Column(name="de_prop_endereco", columnDefinition="NVARCHAR(120)")
	@Getter @Setter
	private String endereco;
	
	@Column(name="de_prop_numero", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String numero;
	
	@Column(name="de_prop_complemento", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String complemento;
	
	@Column(name="de_prop_cep", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String cep;
	
	@Column(name="de_prop_bairro", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String bairro;
	
	@Column(name="de_prop_quadra", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String quadra;
	
	@Column(name="de_prop_fone", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String fone;
	
	@Column(name="de_prop_email", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String email;
	
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Column(name="dt_data_migracao")
	@Getter @Setter
	private Date dataMigracao;

	public ProprietarioDSA() {
		// Construtor vazio Hibernate
	}
	
	public ProprietarioDSA(ProprietarioDestino propDestino) {
		this.setObjectId(propDestino.getObjectId());
		this.setAquisicao(propDestino.getAquisicao());
		this.setBairro(propDestino.getBairro());
		this.setCep(propDestino.getCep());
		this.setCidade(propDestino.getCidade());
		this.setComplemento(propDestino.getComplemento());
		this.setCpf(propDestino.getCpf());
		this.setDataMigracao(propDestino.getDataMigracao());
		this.setEmail(propDestino.getEmail());
		this.setEndereco(propDestino.getEndereco());
		this.setFone(propDestino.getFone());
		this.setNome(propDestino.getNome());
		this.setNumero(propDestino.getNumero());
		this.setQuadra(propDestino.getQuadra());
		this.setUf(propDestino.getUf());
	}
	
}
