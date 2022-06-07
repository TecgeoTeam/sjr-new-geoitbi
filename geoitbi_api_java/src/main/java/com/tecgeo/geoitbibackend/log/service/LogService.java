package com.tecgeo.geoitbibackend.log.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.gson.JsonObject;
import com.tecgeo.geoitbibackend.log.model.Log;
import com.tecgeo.geoitbibackend.util.RequestUtil;


@Service
public class LogService {

	@Autowired
	Environment env;

	@Autowired
	RequestUtil requestUtil;
	
	public void registrarLog(Log log) {
		try {
			this.requestCreateLog(log);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}

	public String requestCreateLog(Log log) throws Exception {
		String url = env.getProperty("service.config.tecadmin.url") + "/api/logs";

		JsonObject args = new JsonObject();
		args.addProperty("mensagem", log.getMensagem());
		args.addProperty("nomeTabela", log.getNomeTabela());
		args.addProperty("tipo", log.getTipo());
		args.addProperty("numeroRegistros", log.getNumeroRegistros());

		return requestUtil.sendPost(url, true, args);
	}

}
