package com.tecgeo.geoitbibackend.migracao.origem.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="TB_TRANSMISSAO")
@SuppressWarnings("serial")
public class Transmissao implements Serializable {
	
	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
    
    @Column(name="nu_id")
    @Getter @Setter
    private Integer id;
    
    @Column(name="nu_numero")
    @Getter @Setter
    private Integer numero;

    @Column(name="de_exercicio", columnDefinition="NVARCHAR(255)")
    @Getter @Setter
    private String exercicio;
    
    @Column(name="nu_codigoimovel")
    @Getter @Setter
    private Integer codigoImovel;
    
    @Column(name="de_inscricao", columnDefinition="NVARCHAR(255)")
    @Getter @Setter
    private String inscricao;
    
    @Column(name="de_endereco", columnDefinition="NVARCHAR(255)")
    @Getter @Setter
    private String endereco;
    
    @Column(name="nu_codigovendedor")
    @Getter @Setter
    private Integer codigoVendedor;
    
    @Column(name="de_vendedor", columnDefinition="NVARCHAR(255)")
    @Getter @Setter
    private String vendedor;
    
    @Column(name="nu_aliquota")
    @Getter @Setter
    private BigDecimal aliquota;
    
    @Column(name="nu_vvt")
    @Getter @Setter
    private BigDecimal vvt;
    
    @Column(name="nu_vve")
    @Getter @Setter
    private BigDecimal vve;
    
    @Column(name="nu_vvi")
    @Getter @Setter
    private BigDecimal vvi;
    
    @Column(name="nu_valorvenda")
    @Getter @Setter
    private BigDecimal valorVenda;
    
    @Column(name="nu_valoritbi")
    @Getter @Setter
    private BigDecimal valorItbi;
    
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Column(name="dt_vencimento")
	@Getter @Setter
	private Date dataVencimento;
	
	public Transmissao() {
		// Construtor vazio hibernate
	}
    
}
