package com.tecgeo.geoitbibackend.foto.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class FotoService {	
	
	@Autowired
	Environment env;
	
	public String create(String foto) {
		String extension = this.getExtension(foto);
		foto = this.ajustarStringFoto(foto);
		
		Long time 			= new Date().getTime();	
		String photoPath 	= env.getProperty("service.config.photo.path") + time + extension;
		String photoUrl 	= env.getProperty("service.config.photo.url") + time + extension;
		Path path = Paths.get(photoPath);
		
		try {
			byte[] bytes 	= Base64.getDecoder().decode(foto.getBytes(StandardCharsets.UTF_8));
			Files.write(path, bytes);
			return photoUrl;
		} catch (IOException e) {
			return null;
		}
	}
	
	public String ajustarStringFoto(String fotoFile) {
		String[] ajustada = fotoFile.split(",");
		return ajustada[1];
	}
	
	public String getExtension(String fotoFile) {
		if (fotoFile.contains("image/png"))
			return ".png";
		
		return ".jpg";	
	}
	
}
