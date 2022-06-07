var validate = require("validate.js");
var hashs = require("../helpers/hashs");
var sessions = require('../helpers/sessions');
var database = require('../helpers/database');

/**
 * Post
 * Listar
 */
exports.Listar= async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        /*try {
           
            var consulta = await pg.query("SELECT * FROM public.t_avaliacoes");

            var groups = [];
            for(var a = 0; a < consulta.rows.length; a++){

                //buscar acls d o grupo
                if(consulta.rows[a].status == 1){
                    var status = "Ativo"
                }else{
                    var status = "Inativo"
                }
            
                var group = {
                    id:consulta.rows[a].id,
                    titulo:consulta.rows[a].titulo,
                    descricao:consulta.rows[a].descricao,
                    status:status,
                    acoes:consulta.rows[a].id
                }
                groups.push(group)
            }

            res.json(groups);
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }*/

        res.json([]);
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}

/**
 * Post
 * Exportar
 */
exports.Exportar= async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        /*try {
           
            var consulta = await pg.query("SELECT * FROM public.t_avaliacoes");

            var groups = [];
            for(var a = 0; a < consulta.rows.length; a++){

                //buscar acls d o grupo
                if(consulta.rows[a].status == 1){
                    var status = "Ativo"
                }else{
                    var status = "Inativo"
                }
            
                var group = {
                    id:consulta.rows[a].id,
                    titulo:consulta.rows[a].titulo,
                    descricao:consulta.rows[a].descricao,
                    status:status,
                    acoes:consulta.rows[a].id
                }
                groups.push(group)
            }

            res.json(groups);
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }*/

        res.json([]);
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}
