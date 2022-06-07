package com.tecgeo.geoitbibackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan({"com.tecgeo.geoitbibackend.master",
				"com.tecgeo.geoitbibackend.migracao",
				"com.tecgeo.geoitbibackend.auth",
				"com.tecgeo.geoitbibackend.foto",
				"com.tecgeo.geoitbibackend.log",
				"com.tecgeo.geoitbibackend.util",
				"com.tecgeo.geoitbibackend.calculo"})
@EntityScan({"com.tecgeo.geoitbibackend.master",
			 "com.tecgeo.geoitbibackend.migracao",
			 "com.tecgeo.geoitbibackend.migracao.destino.model",
			 "com.tecgeo.geoitbibackend.migracao.origem.model",
			 "com.tecgeo.geoitbibackend.migracao.dsa"})
public class Application {

	public static void main(String[] args) {
        @SuppressWarnings("unused")
		ApplicationContext ctx = SpringApplication.run(Application.class, args);              
	}
}
