package com.tecgeo.geoitbibackend.master.transmissao.util;

import java.util.ArrayList;
import java.util.List;

import com.tecgeo.geoitbibackend.migracao.destino.model.UnidadeDestino;

public class DAOUtilUnidades {

	public List<UnidadeDestino> executarDistinct(List<UnidadeDestino> listaRepetidos) {
		List<UnidadeDestino> semRepeticao = new ArrayList<>();
		for (UnidadeDestino u : listaRepetidos) {
			if (!semRepeticao.contains(u))
				semRepeticao.add(u);
		}
		return semRepeticao;
	}
}
