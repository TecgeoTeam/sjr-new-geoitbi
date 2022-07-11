import React from 'react';
import { Redirect } from "react-router-dom";
import PageLoading from '../../components/PageLoading';
import Config from '../../config';
import './style.css';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      logged: "loading"
    };

    //Configuracoes
    this.config = Config.configs()

  }

  componentDidMount() {

    fetch(this.config.appurl+"geoportal/logged", {
      method: 'POST',
      body: JSON.stringify({email:localStorage.getItem('email'), salt:localStorage.getItem('salt')}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(
      //loading
      this.setState(
        {
          logged: "loading"
        }
      )
    )
    .then(
      (response) => {
        if(response.error){
          this.setState(
            {
              logged: "no"
            }
          )
          //limpar a sessão
          localStorage.clear();
        }else{
          this.setState(
            {
              logged: "yes"
            }
          )

          //criar mais dados do usuário (Mostrar Nome)
          //localStorage.setItem('nome', response.usuario.nome);
          
        }
      }
    )

  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  render() {

    let content;

    if(this.state.logged === "yes"){
      
      content = <iframe title="GeoITBI" frameBorder="0" allowtransparency="yes" scrolling="no" src="https://sigribamar.com.br/webapp/index.html" width="100%" height="100%"></iframe>;

    }else if(this.state.logged === "loading"){
      content = <PageLoading />;
    }else{
      content = <Redirect push to="/geoitbi" />;
    }

    return (
      <>
        {content}
      </>
    );
    

  }
}

export default Dashboard;