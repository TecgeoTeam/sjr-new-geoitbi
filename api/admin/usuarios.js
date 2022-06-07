var validate = require("validate.js");
var hashs = require("../helpers/hashs");
var sessions = require('../helpers/sessions');
var database = require('../helpers/database');
var mailer = require('../helpers/mailer');

/**
 * Post
 * Listar todos os médicos da plataforma
 */
exports.ListarUsuarios = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt, rule:"ListarVerUsuarios"});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT * FROM public.t_usuarios ORDER BY nome ASC;");

            var users = [];
            if(consulta.rows && consulta.rows.length > 0){
                for(var a = 0; a < consulta.rows.length; a++){

                    var grupo = await pg.query("SELECT * FROM public.t_grupos WHERE id=$1",[consulta.rows[a].codigo_grupo]);
    
                    if(grupo.rows[0]){
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
 * Buscar Usuário pelo ID
 */
exports.BuscarUsuario = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"ListarVerUsuarios"});
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
 * Excluir Usuário pelo ID
 */
exports.ExcluirUsuario = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirUsuarios"});
    if(user_session != "Err"){
        try {

            if(req.body.idusuario){
                var isadmin = await pg.query("SELECT * FROM public.t_usuarios WHERE id=$1 AND isadmin=$2",[req.body.idusuario, 1]);

                if(!isadmin.rows[0]){
                    await pg.query("DELETE FROM public.t_usuarios WHERE id=$1;",[req.body.idusuario]);
                    const data = { error: false, message: "Usuário removido com sucesso" };
                    res.json(data);
                }else{
                    const data = { error: true, message: "Não é possível remover um super usuário" };
                    res.json(data);
                }
                
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
 * Adicionar Novo Usuário
 */
exports.IncluirUsuario = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirUsuarios"});
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
                    0,
                    req.body.status
                ];
    
                await pg.query("INSERT INTO public.t_usuarios(id, nome, email, perfil, session_hash, session_salt, session_status, password, salt, ps_password, ps_salt, ps_status, codigo_grupo, isadmin, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);",valores);
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
 * Editar Usuário
 */
exports.EditarUsuario = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"EditarExcluirUsuarios"});
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
        var isadmin = await pg.query("SELECT * FROM public.t_usuarios WHERE email=$1 AND isadmin=$2",[req.body.email, 1]);

        if (val) {
            const errors = Object.keys(val).map(field => val[field]);
            const data = { error: true, message: errors.join('') };
            res.json(data);
        }else if (!emailusuario.rows[0] && emailbanco.rows[0]) {
            const data = { error: true, message: "Este email já foi registrado, utilize outro email" };
            res.json(data);
        }else if(isadmin.rows[0]){
            const data = { error: true, message: "Não é possível editar ou excluir um super usuário" };
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

/**
 * Post
 * Buscar Perfil do Usuário pelo Email
 */
exports.BuscarPerfil = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"ModuloAdministrador"});
    if(user_session != "Err"){
        try {
           
            var consulta = await pg.query("SELECT * FROM public.t_usuarios WHERE email=$1;",[req.body.uemail]);

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
 * Editar Perfil de Usuário
 */
exports.EditarPerfil = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt,rule:"ModuloAdministrador"});
    if(user_session != "Err"){
        var constraints;
        if(req.body.password){
            constraints = {
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
                    presence: { message: "^Repita a senha<br/>", allowEmpty: false },
                    equality: {
                        attribute: "password",
                        message: "^A nova senha digitada não confere"
                    }
                }
            };
        }else{
            constraints = {
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
                        req.body.perfil,
                        await hashs.hashGen(req.body.password, salt),
                        salt,
                        req.body.id
                    ];

                    await pg.query("UPDATE public.t_usuarios SET nome=$1, email=$2, perfil=$3, password=$4, salt=$5 WHERE id=$6;",valores);
                    const data = { error: false, message: "Perfil de usuário e Senha editados com sucesso!" };
                    res.json(data);
                }else{
      
                    var valores = [
                        req.body.nome,
                        req.body.email,
                        req.body.perfil,
                        req.body.id
                    ];

                    await pg.query("UPDATE public.t_usuarios SET nome=$1, email=$2, perfil=$3 WHERE id=$4;",valores);
                    const data = { error: false, message: "Perfil de usuário editado com sucesso!" };
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

/**
 * Post
 * Recuperar Senha do usuário
 */
exports.RecuperarSenha = async function (req, res) {
    const pg = await database.connection();
    try {
        
        var consulta = await pg.query("SELECT * FROM public.t_usuarios WHERE email=$1;",[req.body.email_recuperacao]);
        if(consulta.rows[0]){
            //Enviar email com senha provisória
            //Editar senha e salt provisorios

            var salt = await hashs.saltGen();
            var senha_recuperacao = await hashs.idGen();
            var valores = [
                await hashs.hashGen(senha_recuperacao, salt),
                salt,
                1,
                req.body.email_recuperacao
            ];

            await pg.query("UPDATE public.t_usuarios SET ps_password=$1, ps_salt=$2, ps_status=$3 WHERE email=$4;",valores);
                       
 
           //enviar mensagem para o email do candidato
           var dataEmail = {
               title:"Recuperar Senha",
               toemail:req.body.email_recuperacao,
               subject:"Geoportal de ITBI - Recuperação de Senha",
               message:"Segue logo a baixo uma senha provisória para acesso ao Geoportal de ITBI",
               template:"recuperar.ejs",
               content:{
                   name:"Prezado(a)",
                   senha: senha_recuperacao
               }
           }
           
           await mailer.SendMail(dataEmail)
        
             

            const data = { error: false, message: "Uma senha de recuperação foi enviada no email: " + req.body.email_recuperacao };
            res.json(data);
        }else{
            const data = { error: true, message: "O email inserido não existe no banco de dados" };
            res.json(data);
        }
        
    }catch (err) {
        console.log(err)
        const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
        res.json(data);
    }
    
}


