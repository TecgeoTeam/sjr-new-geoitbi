package com.tecgeo.geoitbibackend.terceiraavaliacao.controller;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.math.BigDecimal;
import java.util.Date;

import org.hamcrest.CoreMatchers;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.tecgeo.geoitbibackend.master.terceiraavaliacao.model.TerceiraAvaliacao;
import com.tecgeo.geoitbibackend.master.terceiraavaliacao.repository.ITerceiraAvaliacaoRepository;
import com.tecgeo.geoitbibackend.util.UtilTests;

public class TerceiraAvaliacaoControllerTest extends UtilTests {
	private String baseControllerUrl = "/terceiraavaliacao";

	@Autowired
	private ITerceiraAvaliacaoRepository terceiraAvaliacaoRepository;

	private TerceiraAvaliacao terceiraAvaliacao = new TerceiraAvaliacao("29070148019700000", 
			new BigDecimal("90000.5"), new Date(), "Teste", 
			new BigDecimal("120000"),
			new BigDecimal("46400.678"),
			new BigDecimal("56255.34"),
			new BigDecimal("70000"));
	
	private TerceiraAvaliacao terceiraAvaliacao2 = new TerceiraAvaliacao("17070148023800002",
			new BigDecimal("183580.9"), new Date(), "Teste",
			new BigDecimal("210500.678"),
			new BigDecimal("76400.23"),
			new BigDecimal("80305.11"),
			new BigDecimal("88000.777"));
	
	private TerceiraAvaliacao terceiraAvaliacao3 = new TerceiraAvaliacao("17070148023800002",
			new BigDecimal("224685.30"), new Date(), "Teste",
			new BigDecimal("25050.775"),
			new BigDecimal("76400.23"),
			new BigDecimal("80400.11"),
			new BigDecimal("90050.60"));

	@Before
	public void setup() throws Exception {
		this.mockMvc = webAppContextSetup(webApplicationContext).build();
		terceiraAvaliacaoRepository.deleteAllInBatch();
		terceiraAvaliacaoRepository.save(this.terceiraAvaliacao2);
		terceiraAvaliacaoRepository.save(this.terceiraAvaliacao3);
	}

	@Test
	public void cadastrarAvaliacao() throws Exception {
		String avaliacaoJSON = json(this.terceiraAvaliacao);
		this.mockMvc.perform(post(baseControllerUrl).contentType(contentType).content(avaliacaoJSON))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.geocodigo", equalTo(this.terceiraAvaliacao.getGeocodigo())))
			.andExpect(jsonPath("$.username", equalTo(this.terceiraAvaliacao.getUsername())));
	}
	
	@Test
	public void lerAvaliacoes() throws Exception {
		this.mockMvc.perform(get(baseControllerUrl + "/" 
			+ this.terceiraAvaliacao2.getGeocodigo()))
			.andExpect(content().contentType(contentType))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", notNullValue()))
			.andExpect(jsonPath("$", CoreMatchers.not("[]")))
			.andExpect(jsonPath("$", hasSize(2)));
	}
	
	@Test
	public void lerUltimaAvaliacao() throws Exception {
		this.mockMvc.perform(get(baseControllerUrl + "/latest/" 
			+ this.terceiraAvaliacao2.getGeocodigo()))
			.andExpect(content().contentType(contentType))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", notNullValue()))
			.andExpect(jsonPath("$.geocodigo", 
					equalTo(this.terceiraAvaliacao2.getGeocodigo())))
			.andExpect(jsonPath("$.username", 
					equalTo(this.terceiraAvaliacao2.getUsername())));
	}
}
