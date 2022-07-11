import React from 'react';
import { Badge, Button, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { Redirect } from "react-router-dom";
import Breadcrumbs from '../../components/Breadcrumbs';
import Header from '../../components/Header';
import PageLoading from '../../components/PageLoading';
import Perfil from '../../components/Perfil';
import Sair from '../../components/Sair';
import Sobre from '../../components/Sobre';
import WidgetLoading from '../../components/WidgetLoading';
import Config from '../../config';
import Permissoes from '../Permissoes';
import './style.css';

class LogsSistema extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      logged: "loading",
      fullscreenOn: false,
      PerfilAction: false,
      sairAction:false,
      sobreAction:false,
      error: null,
      isLoaded: true,
      tableData: [],
      openFormAction:false,
      openModalDelete:false,
      openModalPermissoes:false,
      totalRows:0
    };

    this.columns = [
      {
        name: 'Tipo',
        selector: 'tipo',
        sortable: false,
        cell: row => row.status === "Ativo" ? <Badge variant="success">Ativo</Badge> : <Badge variant="danger">Acesso</Badge>,
      },
      {
        name: 'Data/Hora',
        selector: 'data_hora',
        sortable: true
      },
      {
        name: 'Mensagem',
        selector: 'mensagem',
        sortable: false
      },
      {
        name: 'Tabela',
        selector: 'tabela',
        sortable: true
      },
      {
        name: 'Registros',
        selector: 'registros',
        sortable: false
      },
      {
        name: 'Usuário',
        selector: 'codigo_usuario',
        sortable: true
      }

    ];
    
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
      this.setState({logged: "loading"})
    )
    .then(
      (response) => {
        if(response.error){
          this.setState({logged: "no"})
          //limpar a sessão
          localStorage.clear();
        }else{
          this.setState({logged: "yes"})
          this.loadData();
        }
      }
    )
  }


  loadData = () => {
    this.setState({
      isLoaded: false,
      tableData: []
    });
    /*fetch(this.config.appurl+"admin/pesquisas/listar",{
      method: 'POST',
      body: JSON.stringify({uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: false,
            tableData: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      )*/
  }


  modalPermissoes = (open, id) => {
    this.setState({ openModalPermissoes:open, idgrupo:id })
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

  closeAlertMessage = () => {
    this.setState(
      {
        alertMessageStatus: false
      }
    );
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
          
          <Breadcrumbs pagetitle="Logs do Sistema" />

          <div className="main-content-inner">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="card">
                  <div className="card-body">

                    <DataTable
                      columns={this.columns}
                      data={this.state.tableData}
                      progressPending={this.state.isLoaded}
                      progressComponent={<WidgetLoading />}
                      pagination
                      paginationTotalRows={this.state.totalRows}
                      persistTableHead
                      selectableRows
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={this.state.openModalPermissoes}
            onHide={() => this.modalPermissoes(!this.state.openModalPermissoes, null)}
            backdrop="static"
            keyboard={true}
            id="modalPermissoes"
          >
              <Modal.Header closeButton>
                <Modal.Title>Recursos e Permissões</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Permissoes group={this.state.idgrupo}/>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={() => this.modalPermissoes(!this.state.openModalPermissoes, null)}>
                  Fechar
                </Button>
              </Modal.Footer>
            
          </Modal>

      </div>;


    }else if(this.state.logged === "loading"){
      content = <PageLoading />;
    }else{
      content = <Redirect push to="/geoitbi_admin"/>;
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

export default LogsSistema;



