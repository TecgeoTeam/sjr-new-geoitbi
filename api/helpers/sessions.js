var database = require('./database');
var key = require('./keys');
var hashs = require("./hashs");
var database = require('./database');


/**
 * Get Active Session and Token
 */
module.exports.getActiveSession = async function (data) {
    const pg = await database.connection();
    try {
        const usuario = await pg.query("SELECT * FROM public.t_usuarios WHERE email = $1 AND session_status = $2 AND status = $3",[data.email, 1,1]);

        if(usuario.rows[0]){
            
            //verifica se token do frontend é válido
            if(usuario.rows[0].session_salt === data.salt){

                //Verifica as permissões/recursos do usuário
                const resource = await pg.query("SELECT * FROM public.t_acls WHERE codigo_recurso = $1 AND codigo_grupo = $2",[data.rule, usuario.rows[0].codigo_grupo]);
                const acls = await pg.query("SELECT * FROM public.t_acls WHERE codigo_grupo = $1",[usuario.rows[0].codigo_grupo]);
                
                //validação de token em banco de dados
                var s_hash = await hashs.hashGen(key.superKey, usuario.rows[0].session_salt);
                if (s_hash === usuario.rows[0].session_hash) {

                    //possui permissões
                    if(resource.rows[0]){
                        return {usuario:usuario.rows[0], acls:acls.rows}; // <-- Retorna o dados do usuário logado
                    }else{
                        return "Err";
                    }
                    
                }else {
                    return "Err";
                }

            }else{
                return "Err";
            }

        }else{
            return "Err";
        }
    }catch (err) {
        console.log(err)
        return "Err";
    }

}


/**
 * Do Logout
 */
module.exports.Logout = async function (data) {
    const pg = await database.connection();
    try {
        const usuario = await pg.query("SELECT * FROM public.t_usuarios WHERE email = $1 AND session_status = $2",[data.email, 1]);

        if(usuario.rows[0]){
            //verifica se token do frontend é válido
            if(usuario.rows[0].session_salt === data.salt){
                await pg.query("UPDATE public.t_usuarios SET session_hash=$1, session_salt=$2, session_status=$3 WHERE email=$4;",["", "", 0 ,data.email]);
            }
        }
   
    }catch (err) {
        console.log("Erro no logout: "+err)
        return false;
    }
}
