var validate = require("validate.js");
var hashs = require("../helpers/hashs");
var sessions = require('../helpers/sessions');
var database = require('../helpers/database');

/**
 * Post
 * Buscar Email Server
 */
exports.BuscarEmailServer = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt, rule:"EditarServidorEmail"});
    if(user_session != "Err"){
        try {
            var consulta = await pg.query("SELECT * FROM public.t_servidor_email;");
            res.json(consulta.rows[0]);
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
 * Editar Email Server
 */

exports.EditarEmailServer = async function (req, res) {
    const pg = await database.connection();
    var user_session = await sessions.getActiveSession({email:req.body.uemail, salt:req.body.usalt, rule:"EditarServidorEmail"});
    if(user_session != "Err"){

        var constraints = {
                hostname: {
                    presence: { message: "^Insira endereço de host ex: smtp.gmail.com<br/>", allowEmpty: false },
                },
                email: {
                    presence: { message: "^O email de usuário de envio é requerido<br/>", allowEmpty: false },
                    email: { message: "^Insira um email válido<br/>" }
                },
                smtp_port: {
                    presence: { message: "^Insira a porta SMTP ex: 465<br/>", allowEmpty: false },
                },
                host_password: {
                    presence: { message: "^A senha do host é requerida<br/>", allowEmpty: false },
                },
                template_path: {
                    presence: { message: "^Defina o caminho absoluto da pasta de templates em seu servidor<br/>", allowEmpty: false },
                },
                send_email1: {
                    presence: { message: "^O email de resposta 1 é requerido<br/>", allowEmpty: false },
                    email: { message: "^Insira um email válido<br/>" }
                }
                
            };
        
    
        var val = await validate(req.body, constraints);

        if (val) {
            const errors = Object.keys(val).map(field => val[field]);
            const data = { error: true, message: errors.join('') };
            res.json(data);
        }else {

            try {
                var consulta = await pg.query("SELECT * FROM public.t_servidor_email;");
                if(consulta.rows[0]){
                    
                    var valores = [
                        req.body.id,
                        req.body.hostname,
                        req.body.email,
                        req.body.smtp_port,
                        req.body.host_password,
                        req.body.template_path,
                        req.body.default_message,
                        req.body.send_email1,
                        req.body.send_email2,
                        req.body.send_email3,
                        req.body.send_email4
                    ];
    
                    await pg.query("UPDATE public.t_servidor_email SET hostname=$2, email=$3, smtp_port=$4, host_password=$5, template_path=$6, default_message=$7, send_email1=$8, send_email2=$9, send_email3=$10, send_email4=$11 WHERE id=$1;",valores);
                    const data = { error: false, message: "Configurações de Servidor de Email editadas com sucesso!" };
                    res.json(data);
                    
                }else{
                    var codigo = await hashs.idGen(12);
                    var valores = [
                        codigo,
                        req.body.hostname,
                        req.body.email,
                        req.body.smtp_port,
                        req.body.host_password,
                        req.body.template_path,
                        req.body.default_message,
                        req.body.send_email1,
                        req.body.send_email2,
                        req.body.send_email3,
                        req.body.send_email4
                    ];

                    await pg.query("INSERT INTO public.t_servidor_email(id, hostname, email, smtp_port, host_password, template_path, default_message,send_email1,send_email2,send_email3,send_email4) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11);",valores);
                    const data = { error: false, message: "Configurações de Servidor de Email inseridas com sucesso!" };
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
