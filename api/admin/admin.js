var validate = require("validate.js");
var key = require('../helpers/keys');
var hashs = require("../helpers/hashs");
var sessions = require('../helpers/sessions');
var database = require('../helpers/database');


/**
 * Post
 * Do Admin Login Action
 */
exports.DoLogin = async function (req, res) {
    //await sleep(1000);
    
    const pg = await database.connection();
    var rules = {
        email: {
            presence: { message: "^O email do usuário é requerido;<br />", allowEmpty: false }
        },
        password: {
            presence: { message: "^A senha é obrigatória;<br />", allowEmpty: false }
        }
    };

    var valid = await validate(req.body, rules);

    if (valid) {
        const errors = Object.keys(valid).map(field => valid[field]);
        const data = { error: true, message: errors.join('') };
        res.json(data);
    }else {
        try {
            const usuario = await pg.query("SELECT * FROM public.t_usuarios WHERE email = $1 AND status = $2",[req.body.email, 1]);

            if(usuario.rows.length > 0){

                if(usuario.rows[0].ps_status === 0){
                    if(req.body.salt){
                        //verify if password is equivalent to database hash and salt
                        var hash = await hashs.hashGen(req.body.password, usuario.rows[0].salt);
                        if (usuario.rows[0].password === hash) {
    
                            //Find and Update old active sessions
                            //const s_salt = await hashs.saltGen();
                            const s_salt = req.body.salt
                            const s_hash = await hashs.hashGen(key.superKey, s_salt);
    
                            await pg.query("UPDATE public.t_usuarios SET session_hash=$1, session_salt=$2, session_status=$3 WHERE id=$4;",[s_hash, s_salt, 1 ,usuario.rows[0].id]);
                            
                            const data = { error: false, nome:usuario.rows[0].nome, message: "Sessão criada com sucesso!"};
                            res.json(data);
                            
                        }else {
                            const data = { error: true, message: "Senha ou usuário inválidos" };
                            res.json(data);
                        }
                    }else {
                        const data = { error: true, message: "Não foi encontrado um token válido" };
                        res.json(data);
                    }
                }else{
                    if(req.body.salt){
                        //verify if password is equivalent to database hash and salt
                        var hash = await hashs.hashGen(req.body.password, usuario.rows[0].ps_salt);
                        if (usuario.rows[0].ps_password === hash) {
    
                            //Find and Update old active sessions
                            //const s_salt = await hashs.saltGen();
                            const s_salt = req.body.salt
                            const s_hash = await hashs.hashGen(key.superKey, s_salt);
    
                            await pg.query("UPDATE public.t_usuarios SET session_hash=$1, session_salt=$2, session_status=$3, password=$4, salt=$5, ps_password=$6, ps_salt=$7, ps_status=$8 WHERE id=$9;",
                            [s_hash, s_salt, 1,usuario.rows[0].ps_password, usuario.rows[0].ps_salt, '', '', 0, usuario.rows[0].id]);
                            
                            const data = { error: false, nome:usuario.rows[0].nome, message: "Sessão criada com sucesso!"};
                            res.json(data);
                            
                        }else {
                            const data = { error: true, message: "Senha ou usuário inválidos" };
                            res.json(data);
                        }
                    }else {
                        const data = { error: true, message: "Não foi encontrado um token válido" };
                        res.json(data);
                    }
                }

                

            }else {
                const data = { error: true, message: "Este usuário não está cadastrado<br/> ou está inativo" };
                res.json(data);
            }
        }catch (err) {
            console.log(err)
            const data = { error: true, message: "Aconteceu um erro no sistema " + err.name };
            res.json(data);
        }
    }
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   

exports.Logged = async function (req, res) {
    //await sleep(4000);
    var user_session = await sessions.getActiveSession({email:req.body.email, salt:req.body.salt, rule:"ModuloAdministrador"});
    if(user_session != "Err"){
        let userData = {
            error:false,
            usuario:{
                nome:user_session.usuario.nome,
                acls:user_session.acls,
                logged:true
            }
        }
        res.json(userData);
    }else{
        await sessions.Logout({email:req.body.email, salt:req.body.salt});
        const data = { error: true, message: "Não foi possível encontrar uma sessão de usuário"};
        res.json(data);
    }
};

/**
 * Get
 * Logout Admin
 */
exports.DoLogout = async function (req, res) {
    await sessions.Logout({email:req.body.email, salt:req.body.salt});
    const data = { error: false, message: "Sessão encerrada"};
    res.json(data);
};