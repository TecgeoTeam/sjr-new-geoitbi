var validate = require("validate.js");
var hashs = require("../helpers/hashs");
var sessions = require('../helpers/sessions');
var database = require('../helpers/database');


/**
 * Post
 * Listar todos os grupos
 */
exports.ListarGrupos = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"ListarVerGrupos"});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT * FROM public.t_grupos");

            var groups = [];
            if(consulta.rows && consulta.rows.length > 0){
                for(var a = 0; a < consulta.rows.length; a++){

                    //buscar acls do grupo
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
            }

            res.json(groups);
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}

/**
 * Post
 * Buscar Grupo pelo ID
 */
exports.BuscarGrupo = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"ListarVerGrupos"});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT * FROM public.t_grupos WHERE id=$1;",[req.body.idgrupo]);

            res.json(consulta.rows[0]);
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}


/**
 * Post
 * Adicionar Novo Grupo
 */
exports.IncluirGrupo= async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirGrupos"});
    if(user_session != "Err"){
        var constraints = {
            titulo: {
                presence: { message: "^Insira o título do grupo<br/>", allowEmpty: false },
            },
            descricao: {
                presence: { message: "^Insira uma descrição<br/>", allowEmpty: false },
            }
            
        };
    
        var val = await validate(req.body, constraints);

        if (val) {
            const errors = Object.keys(val).map(field => val[field]);
            const data = { error: true, message: errors.join('') };
            res.json(data);
        }else {

            try {
                //salvando dados na base
                var codigo = await hashs.idGen(12);
                var valores = [
                    codigo,
                    req.body.titulo,
                    req.body.descricao,
                    0,
                    req.body.status
                ];

                await pg.query("INSERT INTO public.t_grupos(id, titulo, descricao, isadmin, status) VALUES ($1, $2, $3, $4, $5);",valores);
                const data = { error: false, message: "Um novo grupo foi adicionado com sucesso!" };

                res.json(data);
            }catch (err) {
                console.log(err)
                const data = { error: true, message: "Aconteceu um erro no sistema " + err };
                res.json(data);
            }
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}

/**
 * Post
 * Excluir Grupo pelo ID
 */
exports.ExcluirGrupo = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirGrupos"});
    if(user_session != "Err"){
        try {
           
            if(req.body.idgrupo){
                var isadmin = await pg.query("SELECT * FROM public.t_grupos WHERE id=$1 AND isadmin=$2",[req.body.idgrupo, 1]);

                if(!isadmin.rows[0]){
                    await pg.query("DELETE FROM public.t_grupos WHERE id=$1;",[req.body.idgrupo]);

                    var acls = await pg.query("SELECT * FROM public.t_acls WHERE codigo_grupo=$1;",[req.body.idgrupo]);

                    //Cascade ACLs delete
                    if(acls.rows.length > 0){
                        for(let i = 0; i < acls.rows.length; i++){
                            await pg.query("DELETE FROM public.t_acls WHERE codigo_grupo=$1;",[req.body.idgrupo]);
                        }
                    }
                    const data = { error: false, message: "Grupo removido com sucesso" };
                    res.json(data);

                }else{
                    const data = { error: true, message: "Não é possível remover um super grupo do sistema" };
                    res.json(data);
                }
            }else{
                const data = { error: true, message: "Não foi possível remover o grupo do sistema" };
                res.json(data);
            }
            
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}

/**
 * Post
 * Editar Grupo
 */
exports.EditarGrupo = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirGrupos"});
    if(user_session != "Err"){

        var constraints = {
            titulo: {
                presence: { message: "^Insira o título do grupo<br/>", allowEmpty: false },
            },
            descricao: {
                presence: { message: "^Insira uma descrição<br/>", allowEmpty: false },
            }             
        };
        
        var val = await validate(req.body, constraints);
    
        if (val) {
            const errors = Object.keys(val).map(field => val[field]);
            const data = { error: true, message: errors.join('') };
            res.json(data);
        }else {

            try {
               
                var valores = [
                    req.body.titulo,
                    req.body.descricao,
                    req.body.status,
                    req.body.id
                ];

               
                await pg.query("UPDATE public.t_grupos SET titulo=$1, descricao=$2, status=$3 WHERE id=$4;",valores);
                const data = { error: false, message: "Grupo Editado com sucesso!" };
                res.json(data);

            }catch (err) {
                console.log(err)
                const data = { error: true, message: "Aconteceu um erro no sistema " + err };
                res.json(data);
            }
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}

/**
 * Post
 * Listar todas as permissões
 */
exports.ListarPermissoes = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirGrupos"});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT * FROM public.t_acls WHERE codigo_grupo=$1;",[req.body.idgrupo]);
            var recursos = await pg.query("SELECT * FROM public.t_recursos;");

            var acls = [];
            var resources_dif = [];
            var resources = [];
           
            for(var i = 0; i < recursos.rows.length; i++){

                for(var a = 0; a < consulta.rows.length; a++){

                    if(recursos.rows[i].recurso == consulta.rows[a].codigo_recurso){
                        var rec = {
                            codigo:recursos.rows[i].codigo,
                            recurso:recursos.rows[i].recurso,
                            alias:recursos.rows[i].alias,
                            tipo:recursos.rows[i].tipo,
                            status:recursos.rows[i].status
                        }
                        var acl = {
                            codigo:consulta.rows[a].codigo_recurso,
                            recurso:recursos.rows[i].recurso,
                            alias:recursos.rows[i].alias,
                            tipo:recursos.rows[i].tipo,
                            codigo_grupo:consulta.rows[a].codigo_grupo,
                            status:consulta.rows[a].status
                        }
                        acls.push(acl)
                        resources_dif.push(rec)
                    }
                }

                var rec = {
                    codigo:recursos.rows[i].codigo,
                    recurso:recursos.rows[i].recurso,
                    alias:recursos.rows[i].alias,
                    tipo:recursos.rows[i].tipo,
                    status:recursos.rows[i].status
                }
                resources.push(rec)
                
            }

            if(resources_dif.length > 0){
                resources = resources.filter(ar => !resources_dif.find(rm => (rm.recurso == ar.recurso) ))
            }

            res.json({acls:acls,resources:resources});
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}


/**
 * Post
 * Adicionar Permissão
 */
exports.IncluirPermissao= async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirGrupos"});
    if(user_session != "Err"){
       
        try {
            var recursoexiste = await pg.query("SELECT * FROM public.t_acls WHERE codigo_recurso=$1 AND codigo_grupo=$2",[req.body.codigo_recurso,req.body.codigo_grupo]);

            if(recursoexiste.rows[0]){
                const data = { error: true, message: "Este recurso já foi registrado para este grupo" };
                res.json(data);
            }else{
                //salvando dados na base
                var codigo = await hashs.idGen(12);
                var valores = [
                    codigo,
                    req.body.codigo_recurso,
                    req.body.codigo_grupo,
                    1
                ];

                await pg.query("INSERT INTO public.t_acls(codigo, codigo_recurso, codigo_grupo, status) VALUES ($1, $2, $3, $4);",valores);
                const data = { error: false, message: "Permissão de Recurso foi adicionada com sucesso!" };

                res.json(data);
            }
          
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

/**
 * Post
 * Excluir Permissão
 */
exports.ExcluirPermissao = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirGrupos"});
    if(user_session != "Err"){
        try {
           
            if(req.body.codigo && req.body.grupo){
                await pg.query("DELETE FROM public.t_acls WHERE codigo_recurso=$1 AND codigo_grupo=$2;",[req.body.codigo, req.body.grupo]);
                const data = { error: false, message: "Recurso removido com sucesso" };
                res.json(data);
            }else{
                const data = { error: true, message: "Não foi possível remover o Recurso" };
                res.json(data);
            }
            
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }
    }else{
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
}

