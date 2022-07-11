var sessions = require('../helpers/sessions');
var database = require('../helpers/database');

/**
 * Post
 * Listar Transmissões
 */
exports.Transmissoes = async function (req, res) {
    const mssql = await database.connectionSenografia();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt, rule:"FiltroTrans"});
    if(user_session != "Err"){
        try {
            //console.log(req.body.datefrom)
            //console.log(req.body.dateto)

            /*
            // "stg_geocode": "01061330969"
            // "de_inscricao": "1000613301096900013",
            // "ID": "10090789101125186",
            // "NU_SEQUENCIAL": "10090789",

            // Operadores (Igual, Diferente Maior e Menor)
            // Geocode (stg_geocode / DE_GEOCODE_LOTE)
            // ID da Tranmissão (ID)
            // Tipo Imóvel (DE_USO)
            // Tipologia (DE_TIPO_IMOVEL)
            // Padrão (DE_PADRAO_CONSTRUCAO)
            // Idade (DE_IDADE) Nov  6 2011  3:00AM
            // Area Construída (NU_AREA_CONSTRUIDA)
            // Conservação (DE_CONSERVACAO)
            // Pavimentos (DE_PAVIMENTOS)*/

            var df = req.body.datefrom.split("-");
            var dt = req.body.dateto.split("-");

            //new Date(dt[2], parseInt(dt[1])-1, dt[0])
            var dateFrom = df[2] + "-" + df[0] + "-" + df[1];
            var dateTo   = dt[2] + "-" + dt[0] + "-" + dt[1];

            let filterExpression = "";
            if(req.body.whereUnidade && req.body.whereUnidade.length > 0){

                for(let i = 0; i < req.body.whereUnidade.length; i++){

                    switch(req.body.whereUnidade[i].column){
                        case 'DE_GEOCODE_LOTE':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' + 
                            req.body.whereUnidade[i].operator + ' ' +
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                        case 'ID':
                            filterExpression += ` AND gis.TB_TRANSMISSOES.` + 
                            req.body.whereUnidade[i].column + ' ' +
                            req.body.whereUnidade[i].operator + ' ' +
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                        case 'DE_USO':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' + 
                            req.body.whereUnidade[i].operator + ' ' + 
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                        case 'DE_TIPO_IMOVEL':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' + 
                            req.body.whereUnidade[i].operator + ' ' + 
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                        case 'DE_PADRAO_CONSTRUCAO':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' +
                            req.body.whereUnidade[i].operator + ' ' + 
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                        case 'DE_IDADE':
                            filterExpression += ` AND DATEDIFF(year, gis.TB_UNIDADES_PROP.DE_IDADE, GETDATE())` + 
                            req.body.whereUnidade[i].operator + ' ' +
                            req.body.whereUnidade[i].value;
                        break;
                        case 'NU_AREA_CONSTRUIDA':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' + 
                            req.body.whereUnidade[i].operator + ' ' + 
                            req.body.whereUnidade[i].value;
                        break;
                        case 'DE_CONSERVACAO':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' + 
                            req.body.whereUnidade[i].operator + ' ' + 
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                        case 'DE_PAVIMENTOS':
                            filterExpression += ` AND gis.TB_UNIDADES_PROP.` + 
                            req.body.whereUnidade[i].column + ' ' + 
                            req.body.whereUnidade[i].operator + ' ' + 
                            "'" + req.body.whereUnidade[i].value + "'";
                        break;
                    }
                    
                }
            }

            //console.log(filterExpression)

            let transmissoes = await mssql.request()
            .input('dateFrom', dateFrom)
            .input('dateTo', dateTo)
            .query(
                `
                    SELECT *
                    FROM sjr_cadastro.gis.TB_TRANSMISSOES tt
                    INNER JOIN sjr_cadastro.gis.TB_UNIDADES_PROP
                    ON tt.stg_geocode = sjr_cadastro.gis.TB_UNIDADES_PROP.DE_GEOCODE_LOTE
                    WHERE CONVERT(date, tt.DT_DATA_AVALIACAO, 103) BETWEEN @dateFrom and @dateTo
                    `+filterExpression+`
                ;`
            )


            res.json(transmissoes.recordset);

        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err };
            res.json(data);
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}