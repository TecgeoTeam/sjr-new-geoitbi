package com.tecgeo.geoitbibackend.master.migracao.dsa.model;

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
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tecgeo.geoitbibackend.migracao.destino.model.TransmissaoDestino;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="mig.TEMP_SL_CADASTRO_SDE_TB_TRANSMISSAO")
@SuppressWarnings("serial")
public class TransmissaoDSA implements Serializable {
	
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
	
	public TransmissaoDSA() {
		// Construtor vazio hibernate
	}
	
	public TransmissaoDSA(TransmissaoDestino transmissaoDestino) {
//		this.setObjectId(transmissaoDestino.getObjectId());
//		this.setAliquota(transmissaoDestino.getAliquota());
//		this.setCodigoImovel(transmissaoDestino.getCodigoImovel());
//		this.setCodigoVendedor(transmissaoDestino.getCodigoVendedor());
//		this.setDataVencimento(transmissaoDestino.getDataVencimento());
//		this.setEndereco(transmissaoDestino.getEndereco());
//		this.setExercicio(transmissaoDestino.getExercicio());
//		this.setId(transmissaoDestino.getId());
//		this.setInscricao(transmissaoDestino.getInscricao());
//		this.setNumero(transmissaoDestino.getNumero());
//		this.setValorItbi(transmissaoDestino.getValorItbi());
//		this.setValorVenda(transmissaoDestino.getValorVenda());
//		this.setVendedor(transmissaoDestino.getVendedor());
//		this.setVve(transmissaoDestino.getVve());
//		this.setVvi(transmissaoDestino.getVvi());
//		this.setVvt(transmissaoDestino.getVvt());
	}
    
}
