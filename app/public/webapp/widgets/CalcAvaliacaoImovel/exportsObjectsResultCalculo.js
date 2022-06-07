var image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAABsCAYAAAC/xoSpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NmMxM2JlYS1lM2YwLTBlNGMtOGQ5MC1hMmU3OTFlNWU2OTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OERBNjhGRjYyMTczMTFFOEI4N0FGQTk3RDZGNDBGMDEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OERBNjhGRjUyMTczMTFFOEI4N0FGQTk3RDZGNDBGMDEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NWY4ZmU5NDItZTBjMy1iYTQwLTgwNTgtMWQ3MzEyYWZkNTJkIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGExYTkwNzEtMjE3MC0xMWU4LWE4NDct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"; 

function pdfObjectsBlocos(
    coodY,
    coodX,
    areaTer,
    pavimento,
    testada,
    rendaSetor,
    areaConst,
    conservacao,
    tipologia,
    idade,
    drenagem,
    esgoto,
    topografia,
    bloco,
    zonaUrbana,
    tipoUso,
    inscricao,
    valoresCalculados,
    cub,
    depreciacao,
    pedologia,
    padraoConstrucao
) {
    var blocoI = {
        content: [
            {
                image: image,
                width: 150,
                alignment: 'center',
                margin: [0,0,0,15]
            },
            {
                text: 'Cálculo para o valor da 3ª Avaliação',
                style: 'header'
            },
            {
                text: [{ text: 'Inscrição Imobiliária: ', bold: true }, inscricao]
            },
            {
                text: ['A inscrição imobiliária informada faz parte do ', { text: bloco, bold: true }, ' da planta de valores.']
            },
            {
                text: 'RESUMO DO CÁLCULO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: 'Valor do Terreno:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$', valoresCalculados.valorTerreno.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$', valoresCalculados.valorTerreno.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$', valoresCalculados.valorTerreno.maximo]
            },
            {
                text: [{ text: 'Valor da Edificação ', bold: true }, '= R$', valoresCalculados.valorEdificacao],
                margin: [0, 10, 0, 10]
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$', valoresCalculados.total.maximo]
            },
            {
                text: 'CÁLCULO DETALHADO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: '1.	Cálculo do valor do Terreno',
                style: 'subheader2'
            },
            {
                text: '1.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'VuT = 1 / ( 2,9408787 - 3,6391608e14 * COORD_N² + 1,7637093e-12 * COORD_E² - 0,0061244639*ln(AREA_M2) - 0,0067556626 * PAVIMENTAÇÃO - 0,0082314667 * REDE_DRENAGEM – 1,8714962 * 1/FRENTE_TER² + 11421,995 * 1/RENDA_SETOR - 0,0054046031 * 1/ZONA_PD)^2',
                style: 'contas'
            },
            {
                text: '1.2.	Parâmetros utilizados no cálculo',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VuT', bold: true }, ' = ', 'Valor Unitário;']
            },
            {
                text: [{ text: 'COORD_N', bold: true }, ' = ', 'Coordenada N do centróide da Planta de Valor']
            },
            {
                text: [{ text: 'COORD_E', bold: true }, ' = ', 'Coordenada E do centroide da Planta de Valor',]
            },
            {
                text: [{ text: 'AREA_TER', bold: true }, ' = ', 'Área do Terreno ou Fração Ideal (em casos de Condomínios)']
            },
            {
                text: [{ text: 'PAVIMENTO', bold: true }, ' = ', 'Quantidade de Pavimentos']
            },
            {
                text: [{ text: 'FRENTE_TER', bold: true }, ' = ', 'Testada principal, em metros']
            },
            {
                text: [{ text: 'RENDA_SETOR', bold: true }, ' = ', 'Renda do Setor (V003) da Planta de Valor']
            },
            {
                text: 'OBS: Os demais valores são constantes da fórmula pertencentes a este bloco.',
                margin: [0, 5, 0, 0]
            },
            {
                text: '1.4.	Resultado',
                style: 'subheader3'
            },
            {
                text: [{ text: 'Valor Mínimo do Terreno', bold: true }, ' = R$', valoresCalculados.valorTerreno.minimo]
            },
            {
                text: [{ text: 'Valor Médio do Terreno', bold: true }, ' = R$', valoresCalculados.valorTerreno.medio]
            },
            {
                text: [{ text: 'Valor Máximo do Terreno', bold: true }, ' = R$', valoresCalculados.valorTerreno.maximo]
            },
            {
                text: '2.	Cálculo do valor da Edificação (SINDUSCON-MA):',
                style: 'subheader2',
                margin: [0, 10, 0, 0]
            },
            {
                text: '2.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'VvCd = (AtC) x (Fator de Correção X CUB) x (0,2 + IapC * Depreciação) ',
                style: 'contas'
            },
            {
                text: '2.2.	Parâmetros utilizados no cálculo da edificação',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VvCd', bold: true }, ' = Valor Venal da Construção Depreciado']
            },
            {
                text: [{ text: 'Fator de Correção x CUB', bold: true }]
            },
            {
                text: [{ text: 'Tipologia', bold: true }, ' = Tipologia do imóvel para definição do CUB']
            },
            {
                text: [{ text: 'Padrão de Construção', bold: true }, ' = Padrão de construção do imóvel para definição da depreciação']
            },
            {
                text: [{ text: 'IapC', bold: true }, ' =  Índice de aproveitamento da construção = 80%']
            },
            {
                text: [{ text: 'D', bold: true }, ' = Depreciação do imóvel (Ross/Heidecke)']
            },
            {
                text: [{ text: 'Estado de Conservação', bold: true }, ' = Estado de conservação do imóvel para definição da depreciação']
            },
            {
                text: [{ text: 'AtC', bold: true }, ' = O valor da área Construída da Edificação']
            },
            {
                text: 'OBS: Os demais valores são constantes da fórmula pertencentes a este bloco.',
                margin: [0, 10, 0, 0]
            },
            {
                text: '2.3. Resultado',
                style: 'subheader3'
            },
            {
                text: [{ text: 'Valor da Edificação', bold: true }, ' = ', valoresCalculados.valorEdificacao]
            },
            {
                text: '3.	VALOR TOTAL DO IMÓVEL',
                style: 'subheader2',
                margin: [0, 10, 0, 0]
            },
            {
                text: '3.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'Valor do imóvel = VT + VE',
                style: 'contas'
            },
            {
                text: '3.2.	Parâmetros utilizados no cálculo',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VT', bold: true }, ' = Valor calculado para o Terreno']
            },
            {
                text: [{ text: 'VE', bold: true }, ' = Valor calculado para a Edificação']
            },
            {
                text: '3.3.	Resolução do cálculo',
                style: 'subheader3'
            },
            {
                text: 'Valor do imóvel (Mínimo) = VE + Valor Mínimo do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.minimo + ' = ' + valoresCalculados.total.minimo,
                style: 'contas'
            },
            {
                text: 'Médio: VE + Valor Médio do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.medio + ' = ' + valoresCalculados.total.medio,
                style: 'contas'
            },
            {
                text: 'Máximo: VE + Valor Máximo do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.maximo + ' = ' + valoresCalculados.total.maximo,
                style: 'contas'
            },
            {
                text: '3.4.	Resultado',
                style: 'subheader3'
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo', bold: true }, ' = R$', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio', bold: true }, ' = R$', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo', bold: true }, ' = R$', valoresCalculados.total.maximo]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true,
                margin: [0, 20, 0, 10]
            },
            subheader2: {
                fontSize: 15,
                bold: true,
            },
            subheader3: {
                fontSize: 14,
                bold: true,
                margin: [20, 10, 0, 5]
            },
            contas: {
                italics: true
            },
            conteudo: {
                fontSize: 10
            }
        }
    }

    var blocoII = {
        content: [
            {
                image: image,
                width: 150,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            {
                text: 'Cálculo para o valor da 3ª Avaliação',
                style: 'header'
            },
            {
                text: [{ text: 'Inscrição Imobiliária: ', bold: true }, inscricao]
            },
            {
                text: ['A inscrição imobiliária informada faz parte do ', { text: bloco, bold: true }, ' da planta de valores.']
            },
            {
                text: 'RESUMO DO CÁLCULO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: 'Valor do Terreno:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$', valoresCalculados.valorTerreno.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$', valoresCalculados.valorTerreno.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$', valoresCalculados.valorTerreno.maximo]
            },
            {
                text: [{ text: 'Valor da Edificação ', bold: true }, '= R$', valoresCalculados.valorEdificacao],
                margin: [0, 10, 0, 10]
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$', valoresCalculados.total.maximo]
            },
            {
                text: 'CÁLCULO DETALHADO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: '1.	Cálculo do valor do Terreno',
                style: 'subheader2'
            },
            {
                text: '1.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'Ln (VuT) = - 909,28984 + 9,8403863e12*COORD_N² + -3,9880026e-11 * COORD_E² - 0,51088573 * Ln(AREA_M2) + 0,44641052 * PAVIMENTO + 0,13254816 * FRENTE_TER½ + 245,7449/RENDA_SETOR½ - 0,62549788*PEDOLOGIA + 0,64981452 * 1/ZONA_PD',
                style: 'contas'
            },
            {
                text: '1.2.	Parâmetros utilizados no cálculo',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VuT ', bold: true }, '= Valor Unitário do Terreno']
            },
            {
                text: [{ text: 'COORD_N', bold: true }, ' = Coordenada N do centróide da Planta de Valor']
            },
            {
                text: [{ text: 'COORD_E', bold: true }, ' = Coordenada E do centróide da Planta de Valor']
            },
            {
                text: [{ text: 'AREA_TER', bold: true }, ' = Área do Terreno ou Fração Ideal (em casos de Condomínios)']
            },
            {
                text: [{ text: 'PADRAO_CONSERVA', bold: true }, ' = Padrão da Conservação']
            },
            {
                text: [{ text: 'TIPO', bold: true }, ' = Tipologia do Imóvel']
            },
            {
                text: [{ text: 'FRENTE_TER', bold: true }, ' = Testada principal, em metros']
            },
            {
                text: [{ text: 'IDADE', bold: true }, ' – Idade do Ímovel']
            },
            {
                text: [{ text: 'RENDA_SETOR', bold: true }, ' = Renda do Setor (V003) da Planta de Valor']
            },
            {
                text: 'OBS: Os demais valores são constantes da fórmula pertencentes a este bloco.',
                margin: [0, 5, 0, 0]
            },
            {
                text: '1.4.	Resultado',
                style: 'subheader3'
            },
            {
                text: [{ text: 'Valor Mínimo do Terreno', bold: true }, ' = R$', valoresCalculados.valorTerreno.minimo]
            },
            {
                text: [{ text: 'Valor Médio do Terreno', bold: true }, ' = R$', valoresCalculados.valorTerreno.medio]
            },
            {
                text: [{ text: 'Valor Máximo do Terreno', bold: true }, ' = R$', valoresCalculados.valorTerreno.maximo]
            },
            {
                text: '2.	Cálculo do valor da Edificação (SINDUSCON-MA):',
                style: 'subheader2',
                margin: [0, 10, 0, 0]
            },
            {
                text: '2.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'VvCd = (AtC) x (Fator de Correção X CUB) x (0,2 + IapC * Depreciação) ',
                style: 'contas'
            },
            {
                text: '2.2.	Parâmetros utilizados no cálculo da edificação',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VvCd', bold: true }, ' = Valor Venal da Construção Depreciado']
            },
            {
                text: [{ text: 'Fator de Correção x CUB', bold: true }]
            },
            {
                text: [{ text: 'Tipologia', bold: true }, ' = Tipologia do imóvel para definição do CUB']
            },
            {
                text: [{ text: 'Padrão de Construção', bold: true }, ' = Padrão de construção do imóvel para definição da depreciação']
            },
            {
                text: [{ text: 'IapC', bold: true }, ' =  Índice de aproveitamento da construção = 80%']
            },
            {
                text: [{ text: 'D', bold: true }, ' = Depreciação do imóvel (Ross/Heidecke)']
            },
            {
                text: [{ text: 'Estado de Conservação', bold: true }, ' = Estado de conservação do imóvel para definição da depreciação']
            },
            {
                text: [{ text: 'AtC', bold: true }, ' = O valor da área Construída da Edificação']
            },
            {
                text: 'OBS: Os demais valores são constantes da fórmula pertencentes a este bloco.',
                margin: [0, 10, 0, 0]
            },
            {
                text: '2.3.	Resolução do cálculo',
                style: 'subheader3'
            },
            {
                text: 'VE = 0,20 * ' + cub + ' * ' + areaConst + ' + 0,80 * ' + cub + ' * ' + depreciacao + ' * ' + areaConst + ' = ' + valoresCalculados.valorEdificacao,
                style: 'contas'
            },
            {
                text: '2.4. Resultado',
                style: 'subheader3'
            },
            {
                text: [{ text: 'Valor da Edificação', bold: true }, ' = ', valoresCalculados.valorEdificacao]
            },
            {
                text: '3.	VALOR TOTAL DO IMÓVEL',
                style: 'subheader2',
                margin: [0, 10, 0, 0]
            },
            {
                text: '3.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'Valor do imóvel = VT + VE',
                style: 'contas'
            },
            {
                text: '3.2.	Parâmetros utilizados no cálculo',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VT', bold: true }, ' = Valor calculado para o Terreno']
            },
            {
                text: [{ text: 'VE', bold: true }, ' = Valor calculado para a Edificação']
            },
            {
                text: '3.3.	Resolução do cálculo',
                style: 'subheader3'
            },
            {
                text: 'Valor do imóvel (Mínimo) = VE + Valor Mínimo do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.minimo + ' = ' + valoresCalculados.total.minimo,
                style: 'contas'
            },
            {
                text: 'Médio: VE + Valor Médio do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.medio + ' = ' + valoresCalculados.total.medio,
                style: 'contas'
            },
            {
                text: 'Máximo: VE + Valor Máximo do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.maximo + ' = ' + valoresCalculados.total.maximo,
                style: 'contas'
            },
            {
                text: '3.4.	Resultado',
                style: 'subheader3'
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo', bold: true }, ' = R$', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio', bold: true }, ' = R$', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo', bold: true }, ' = R$', valoresCalculados.total.maximo]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true,
                margin: [0, 20, 0, 10]
            },
            subheader2: {
                fontSize: 15,
                bold: true,
            },
            subheader3: {
                fontSize: 14,
                bold: true,
                margin: [20, 10, 0, 5]
            },
            contas: {
                italics: true
            }
        }

    }

    var blocoIII = {
        content: [
            {
                image: image,
                width: 150,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            {
                text: 'Cálculo para o valor da 3ª Avaliação',
                style: 'header'
            },
            {
                text: [{ text: 'Inscrição Imobiliária: ', bold: true }, inscricao]
            },
            {
                text: ['A inscrição imobiliária informada faz parte da ', { text: bloco, bold: true }, ' da planta de valores.']
            },
            // {
            //     text: [{ text: 'Este documento é baseado na Lei Complementar Nº 54 de dezembro de 2018.', bold: true, fontSize: 10}],
            //     margin: [0, 10, 0, 10]
            // },
            {
                text: 'RESUMO DO CÁLCULO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: 'Valor do Terreno:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$ ', valoresCalculados.valorTerreno.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$ ', valoresCalculados.valorTerreno.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$ ', valoresCalculados.valorTerreno.maximo]
            },
            {
                text: [{ text: 'Valor da Edificação ', bold: true }, '= R$ ', valoresCalculados.valorEdificacao],
                margin: [0, 10, 0, 10]
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$ ', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$ ', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$ ', valoresCalculados.total.maximo]
            },
            {
                text: 'CÁLCULO DETALHADO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: '1.	Cálculo do valor do Terreno',
                style: 'subheader2'
            },
            {
                text: '1.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'VuT = (VAL_MERC½) / AREA_M2' +
                '\n VAL_MERC¹/² = - 328853,42 + 3,1307276e+19 * 1/COORD_N² + -9,064312e+14 * 1/COORD_E² + 1,3020109e05 * AREA_M2² + -1776,4398 * 1/FRENTE_TER² + 14,233483 * AREA_CONST½ + -0,018403858 * IDADE² + 2,3550851e-05 * RENDA_SETOR² + 10,602951 * ZONA_PD²',
                style: 'contas'
            },
            {
                text: '1.2.	Parâmetros utilizados no cálculo',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VuT ', bold: true }, '= Valor Unitário do Terreno']
            },
            {
                text: [{ text: 'COORD_N', bold: true }, ' = Coordenada N do centróide da Planta de Valor']
            },
            {
                text: [{ text: 'COORD_E', bold: true }, ' = Coordenada E do centróide da Planta de Valor']
            },
            {
                text: [{ text: 'AREA_TER', bold: true }, ' = Área do Terreno ou Fração Ideal (em casos de Condomínios)']
            },
            {
                text: [{ text: 'REDE_DRENAGEM', bold: true }, ' = Existência de rede de drenagem']
            },
            {
                text: [{ text: 'FRENTE_TER', bold: true }, ' – Testada principal, em metros'],
            },
            {
                text: [{ text: 'RENDA_SETOR', bold: true }, ' = Renda do Setor (V003) da Planta de Valor']
            },
            {
                text: 'OBS: Os demais valores são constantes da fórmula pertencentes a este bloco.',
                margin: [0, 5, 0, 0]
            },
            {
                text: '2.	Cálculo do valor da Edificação (SINDUSCON-MA):',
                style: 'subheader2',
                margin: [0, 10, 0, 0]
            },
            {
                text: '2.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'VvCd = (AtC) x (Fator de Correção X CUB) x (0,2 + IapC * Depreciação) ',
                style: 'contas'
            },
            {
                text: '2.2.	Parâmetros utilizados no cálculo da edificação',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VvCd', bold: true }, ' = Valor Venal da Construção Depreciado']
            },
            {
                text: [{ text: 'Fator de Correção x CUB', bold: true }]
            },
            {
                text: [{ text: 'Tipologia', bold: true }, ' = Tipologia do imóvel para definição do CUB']
            },
            {
                text: [{ text: 'Padrão de Construção', bold: true }, ' = Padrão de construção do imóvel para definição da depreciação']
            },
            {
                text: [{ text: 'IapC', bold: true }, ' =  Índice de aproveitamento da construção = 80%']
            },
            {
                text: [{ text: 'D', bold: true }, ' = Depreciação do imóvel (Ross/Heidecke)']
            },
            {
                text: [{ text: 'Estado de Conservação', bold: true }, ' = Estado de conservação do imóvel para definição da depreciação']
            },
            {
                text: [{ text: 'AtC', bold: true }, ' = O valor da área Construída da Edificação']
            },
            {
                text: 'OBS: Os demais valores são constantes da fórmula pertencentes a este bloco.',
                margin: [0, 10, 0, 0]
            },
            {
                text: '3.	VALOR TOTAL DO IMÓVEL',
                style: 'subheader2',
                margin: [0, 10, 0, 0]
            },
            {
                text: '3.1.	Fórmula',
                style: 'subheader3'
            },
            {
                text: 'Valor do imóvel = VT + VE',
                style: 'contas'
            },
            {
                text: '3.2.	Parâmetros utilizados no cálculo',
                style: 'subheader3'
            },
            {
                text: [{ text: 'VT', bold: true }, ' = Valor calculado para o Terreno']
            },
            {
                text: [{ text: 'VE', bold: true }, ' = Valor calculado para a Edificação']
            },
            {
                text: '3.3.	Resolução do cálculo',
                style: 'subheader3'
            },
            {
                text: 'Valor do imóvel (Mínimo) = VE + Valor Mínimo do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.minimo + ' = ' + valoresCalculados.total.minimo,
                style: 'contas'
            },
            {
                text: 'Médio: VE + Valor Médio do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.medio + ' = ' + valoresCalculados.total.medio,
                style: 'contas'
            },
            {
                text: 'Máximo: VE + Valor Máximo do Terreno = ' + valoresCalculados.valorEdificacao + ' + ' + valoresCalculados.valorTerreno.maximo + ' = ' + valoresCalculados.total.maximo,
                style: 'contas'
            },
            {
                text: '3.4.	Resultado',
                style: 'subheader3'
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo', bold: true }, ' = R$ ', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio', bold: true }, ' = R$ ', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo', bold: true }, ' = R$ ', valoresCalculados.total.maximo]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true,
                margin: [0, 20, 0, 10]
            },
            subheader2: {
                fontSize: 15,
                bold: true,
            },
            subheader3: {
                fontSize: 14,
                bold: true,
                margin: [20, 10, 0, 5]
            },
            contas: {
                italics: true
            }
        }

    }

    if (bloco === 'ZONA CALCULO 01') {
        return blocoI
    } else if (bloco === 'ZONA CALCULO 02') {
        return blocoII
    } else if (bloco === 'ZONA CALCULO 03') {
        return blocoIII
    }
}

function pdfObjectBlocosResumido(
    bloco,
    inscricao,
    valoresCalculados
) {
    let object = {
        content: [
            {
                image: image,
                width: 150,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            {
                text: 'Cálculo para o valor da 3ª Avaliação',
                style: 'header'
            },
            {
                text: [{ text: 'Inscrição Imobiliária: ', bold: true }, inscricao]
            },
            {
                text: ['A inscrição imobiliária informada faz parte do ', { text: bloco, bold: true }, ' da planta de valores.']
            },
            {
                text: 'RESUMO DO CÁLCULO',
                alignment: 'center',
                style: 'subheader'
            },
            {
                text: 'Valor do Terreno:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$', valoresCalculados.valorTerreno.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$', valoresCalculados.valorTerreno.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$', valoresCalculados.valorTerreno.maximo]
            },
            {
                text: [{ text: 'Valor da Edificação ', bold: true }, '= R$', valoresCalculados.valorEdificacao],
                margin: [0, 10, 0, 10]
            },
            {
                text: 'Valor do Imóvel:',
                bold: true
            },
            {
                text: [{ text: 'Mínimo ', bold: true }, '= R$', valoresCalculados.total.minimo]
            },
            {
                text: [{ text: 'Médio ', bold: true }, '= R$', valoresCalculados.total.medio]
            },
            {
                text: [{ text: 'Máximo ', bold: true }, '= R$', valoresCalculados.total.maximo]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true,
                margin: [0, 20, 0, 10]
            },
            subheader2: {
                fontSize: 15,
                bold: true,
            },
            subheader3: {
                fontSize: 14,
                bold: true,
                margin: [20, 10, 0, 5]
            },
            contas: {
                italics: true
            }
        }
    }
    return object
}