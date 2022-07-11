import React from 'react';
import { Card, CardDeck } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import Breadcrumbs from '../../components/Breadcrumbs';
import Header from '../../components/Header';
import PageLoading from '../../components/PageLoading';
import Perfil from '../../components/Perfil';
import Sair from '../../components/Sair';
import Sobre from '../../components/Sobre';
import Config from '../../config';
import './style.css';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      logged: "loading",
      fullscreenOn: false,
      PerfilAction: false,
      sairAction:false,
      sobreAction:false,
    };

    //Configuracoes
    this.config = Config.configs()

  }

  componentDidMount() {

    fetch(this.config.appurl+"admin/logged", {
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

  //Fullscreen Widget
  handleOpenFullscreen = () => document.documentElement.requestFullscreen();
  handleExitFullscreen = () => document.exitFullscreen();
  toggleFullscreen = (action) =>{
    this.setState({ fullscreenOn: action })

    if(action){
      this.handleOpenFullscreen()
    }else{
      if(document.fullscreenElement){
        this.handleExitFullscreen()
      }
    }
  }

  openPerfil = (action) =>{
    this.setState({ PerfilAction: action })
  }

  closeSair = (action) =>{
    this.setState({ sairAction: action })
  }

  openSobre = (action) =>{
    this.setState({ sobreAction: action })
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  render() {

    let content;

    if(this.state.logged === "yes"){
      content = <div className="cover-container d-flex w-100 h-100 mx-auto flex-column">
          <Header
            toggleFullscreen={() => this.toggleFullscreen(!this.state.fullscreenOn)}
            openPerfil={() => this.openPerfil(!this.state.PerfilAction)}
            closeSair={() => this.closeSair(!this.state.sairAction)}
            openSobre={() => this.openSobre(!this.state.sobreAction)}
          />
          
          <Breadcrumbs pagetitle="Painel Inicial" />

          <div className="main-content-inner">
            <div className="row">
              <div className="col-12 mt-5">
              <CardDeck>
                <Card>
                  <Card.Img variant="top" src="/geoitbi_admin/service01.png" />
                  <Card.Body>
                    <Card.Title>Gerenciamento de Usuários e Grupos</Card.Title>
                    <Card.Text>
                      Seja bem vindo(a) ao módulo administrativo do Geoportal de ITBI
                      neste ambiente é possível gerenciar os usuários que podem acessar a ferramenta
                      bem como definir seus grupos e permissões de uso.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      <Link to="/geoitbi_admin/usuarios">Ver Usuários</Link>
                      {" / "}
                      <Link to="/geoitbi_admin/grupos">Ver Grupos</Link>
                    </small>
                  </Card.Footer>
                </Card>
                <Card>
                  <Card.Img variant="top" src="/geoitbi_admin/service03.png" />
                  <Card.Body>
                    <Card.Title>Configurações do Geoportal</Card.Title>
                    <Card.Text>
                      O usuário administrativo pode realizar configurações de envio de email, bem como outros
                      atributos como URls, CUB e Categorias.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      <Link to="/geoitbi_admin/servidoremail">Servidor de Email</Link>
                      {" / "}
                      <Link to="/geoitbi_admin/urls">URLs</Link>
                      {" / "}
                      <Link to="/geoitbi_admin/cub">CUB</Link>
                    </small>
                  </Card.Footer>
                </Card>
                <Card>
                  <Card.Img variant="top" src="/geoitbi_admin/service02.png" />
                  <Card.Body>
                    <Card.Title>Integração e Logs</Card.Title>
                    <Card.Text>
                     O administrador poderá configurar as Integrações/Migrações dos 
                     dados da base de dados TINUS para a base de dados principal do 
                     Geoportal de ITBI.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      <Link to="/geoitbi_admin/integracoes">Integração</Link>
                      {" / "}
                      <Link to="/geoitbi_admin/logs">Logs do Sistema</Link>
                    </small>
                  </Card.Footer>
                </Card>
              </CardDeck>
              </div>
            </div>
          </div>


      </div>;
    }else if(this.state.logged === "loading"){
      content = <PageLoading />;
    }else{
      content = <Redirect push to="/geoitbi_admin/geoitbi_admin"/>;
    }

    return (
      <>
        {content}
        {this.state.PerfilAction ? <Perfil openPerfil={() => this.openPerfil(!this.state.PerfilAction)} /> : null}
        {this.state.sairAction ? <Sair closeSair={() => this.closeSair(!this.state.sairAction)} /> : null}
        {this.state.sobreAction ? <Sobre openSobre={() => this.openSobre(!this.state.sobreAction)} /> : null}
      </>
    );
    

  }
}

export default Dashboard;


/**
 * 
 * const EsriMap = React.lazy(() => import('../../components/EsriMap'));
const Header = React.lazy(() => import('../../components/Header'));
const Window = React.lazy(() => import('../../components/Window'));
 * <Suspense fallback={<div>Loading...</div>}>
              
              <Header/>
              <EsriMap />
              <Window />
              
            </Suspense>
 */
