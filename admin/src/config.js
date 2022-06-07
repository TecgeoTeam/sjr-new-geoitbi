class AppConf{

    configs(){
        const variables = {
            //"appurl":"http://localhost:6050/"
            "appurl":"http://107.180.106.82:6010/"
        }
        return variables;
    }

    async session(){
        let config = this.configs();

        let logado = await fetch(config.appurl+"admin/logged", {
            method: 'POST',
            body: JSON.stringify({email:localStorage.getItem('email'), salt:localStorage.getItem('salt')}),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let dadosUsuario = await logado.json();

        if(dadosUsuario){
            return dadosUsuario;
        }else{
            return [];
        }
    }

    auth(acls,rule){
        let auth = [];
        if(acls.length > 0){
            for(let i = 0; i < acls.length; i++){
                if(rule === acls[i].codigo_recurso){
                    auth.push(acls[i].codigo_recurso)
                }
            }
        }
        return auth;
    }
   
}
  
  const appConfig = new AppConf();
  export default appConfig;