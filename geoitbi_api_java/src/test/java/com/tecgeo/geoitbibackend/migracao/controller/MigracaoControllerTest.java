package com.tecgeo.geoitbibackend.migracao.controller;

import static org.hamcrest.CoreMatchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;

import com.tecgeo.geoitbibackend.util.UtilTests;

public class MigracaoControllerTest extends UtilTests {
	private String baseControllerUrl = "/integracao";

	@Before
	public void setup() throws Exception {
		this.mockMvc = webAppContextSetup(webApplicationContext).build();
	}
	
	@Test
	public void iniciarMigracao() throws Exception {
		this.mockMvc.perform(get(baseControllerUrl))
				.andExpect(content().contentType(contentType))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", notNullValue()));
	}
}
