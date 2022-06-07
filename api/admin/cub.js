var validate = require("validate.js");
var hashs = require("../helpers/hashs");
var sessions = require('../helpers/sessions');
var database = require('../helpers/database');


/**
 * Post
 * Listar
 */
exports.Listar = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT id, nome, email, codigo_grupo, status FROM public.t_usuarios ORDER BY nome DESC;");

            var users = [];
            for(var a = 0; a < consulta.rows.length; a++){

                var grupo = await pg.query("SELECT * FROM public.t_grupos WHERE id=$1",[consulta.rows[a].codigo_grupo]);

                if(grupo.rows){
                    var gru = grupo.rows[0].titulo
                }else{
                    var gru = "Grupo Não Definido"
                }

                if(consulta.rows[a].status == 1){
                    var status = "Ativo"
                }else{
                    var status = "Inativo"
                }
            
                var user = {
                    id:consulta.rows[a].id,
                    nome:consulta.rows[a].nome,
                    email:consulta.rows[a].email,
                    grupo:gru,
                    status:status
                }
                users.push(user)
            }

            res.json(users);
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
 * Buscar pelo ID
 */
exports.Buscar = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT * FROM public.t_usuarios WHERE id=$1;",[req.body.idusuario]);

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
 * Excluir pelo ID
 */
exports.Excluir = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        try {
           
            if(req.body.idusuario){
                await pg.query("DELETE FROM public.t_usuarios WHERE id=$1;",[req.body.idusuario]);
                const data = { error: false, message: "Usuário removido com sucesso" };
                res.json(data);
            }else{
                const data = { error: true, message: "Não foi possível remover o usuário do sistema" };
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
 * Adicionar Novo
 */
exports.Incluir = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        var constraints = {
            nome: {
                presence: { message: "^Insira o nome do usuário<br/>", allowEmpty: false },
            },
            email: {
                presence: { message: "^O email de usuário é requerido<br/>", allowEmpty: false },
                email: { message: "^Insira um email válido<br/>" }
            },
            password: {
                presence: { message: "^A senha é requerida<br/>", allowEmpty: false },
                length: {
                    minimum: 6,
                    maximum: 14,
                    message: "^A senha precisa ter entre 6 e 14 caracteres<br/>"
                }
            },
            repassword: {
                presence: { message: "^Repita a senha<br/>", allowEmpty: false },
                equality: {
                    attribute: "password",
                    message: "^A nova senha digitada não confere"
                }
            }
        };
    
        var val = await validate(req.body, constraints);

        var emailexiste = await pg.query("SELECT * FROM public.t_usuarios WHERE email=$1",[req.body.email]);
    
        if (val) {
            const errors = Object.keys(val).map(field => val[field]);
            const data = { error: true, message: errors.join('') };
            res.json(data);
        }else if (emailexiste.rows[0]) {
            const data = { error: true, message: "Este email já foi registrado, utilize outro para criar a conta." };
            res.json(data);
        }else {

            try {
                //salvando dados na base
                var codigo = await hashs.idGen(12);
                var salt = await hashs.saltGen();
                var valores = [
                    codigo,
                    req.body.nome,
                    req.body.email,
                    "",
                    "",
                    "",
                    0,
                    await hashs.hashGen(req.body.password, salt),
                    salt,
                    "",
                    "",
                    0,
                    req.body.codigo_grupo,
                    req.body.status
                ];
    
                await pg.query("INSERT INTO public.t_usuarios(id, nome, email, perfil, session_hash, session_salt, session_status, password, salt, ps_password, ps_salt, ps_status, codigo_grupo, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);",valores);
                const data = { error: false, message: "Um novo usuário foi adicionado com sucesso!" };

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
 * Editar
 */
exports.Editar = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt});
    if(user_session != "Err"){
        if(req.body.password){
            var constraints = {
                nome: {
                    presence: { message: "^Insira o nome do usuário<br/>", allowEmpty: false },
                },
                email: {
                    presence: { message: "^O email de usuário é requerido<br/>", allowEmpty: false },
                    email: { message: "^Insira um email válido<br/>" }
                },
                password: {
                    presence: { message: "^A senha atual é requerida<br/>", allowEmpty: false },
                    length: {
                        minimum: 6,
                        maximum: 14,
                        message: "^A senha precisa ter entre 6 e 14 caracteres<br/>"
                    }
                },
                repassword: {
                    equality: {
                        attribute: "password",
                        message: "^A nova senha digitada não confere"
                    }
                }
            };
        }else{
            var constraints = {
                nome: {
                    presence: { message: "^Insira o nome do usuário<br/>", allowEmpty: false },
                },
                email: {
                    presence: { message: "^O email de usuário é requerido<br/>", allowEmpty: false },
                    email: { message: "^Insira um email válido<br/>" }
                }                
            };
        }
    
        var val = await validate(req.body, constraints);

        //Email persistente na edição
        var emailusuario = await pg.query("SELECT * FROM public.t_usuarios WHERE email=$1 AND id=$2",[req.body.email, req.body.id]);
        var emailbanco = await pg.query("SELECT * FROM public.t_usuarios WHERE email=$1",[req.body.email]);

    
        if (val) {
            const errors = Object.keys(val).map(field => val[field]);
            const data = { error: true, message: errors.join('') };
            res.json(data);
        }else if (!emailusuario.rows[0] && emailbanco.rows[0]) {
            const data = { error: true, message: "Este email já foi registrado, utilize outro email" };
            res.json(data);
        }else {

            try {
                //salvando dados na base
                if(req.body.password){
                    var salt = await hashs.saltGen();
                    var valores = [
                        req.body.nome,
                        req.body.email,
                        await hashs.hashGen(req.body.password, salt),
                        salt,
                        req.body.codigo_grupo,
                        req.body.status,
                        req.body.id,
                    ];

                    await pg.query("UPDATE public.t_usuarios SET nome=$1, email=$2, password=$3, salt=$4, codigo_grupo=$5, status=$6 WHERE id=$7;",valores);
                    const data = { error: false, message: "Usuário e Senha editados com sucesso!" };
                    res.json(data);
                }else{
      
                    var valores = [
                        req.body.nome,
                        req.body.email,
                        req.body.codigo_grupo,
                        req.body.status,
                        req.body.id
                    ];

                    await pg.query("UPDATE public.t_usuarios SET nome=$1, email=$2, codigo_grupo=$3, status=$4 WHERE id=$5;",valores);
                    const data = { error: false, message: "Usuário editado com sucesso!" };
                    res.json(data);
                }
 
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
