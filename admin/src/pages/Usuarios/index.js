import React from 'react';
import { Redirect  } from "react-router-dom";
import {Navbar, Nav, Form, Button, Col, Modal, Alert, Badge}  from "react-bootstrap";
import ClipLoader from "react-spinners/BarLoader";
import ReactHtmlParser from 'react-html-parser';
import Perfil from '../../components/Perfil';
import Sobre from '../../components/Sobre';
import Sair from '../../components/Sair';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import PageLoading from '../../components/PageLoading';
import WidgetLoading from '../../components/WidgetLoading';
import Config from '../../config';

import DataTable from 'react-data-table-component';
import {MdPersonAdd, MdEdit, MdRemoveCircleOutline} from 'react-icons/md';
import './style.css';

class Usuarios extends React.Component {

  constructor(props) {
    super(props);

    this.footerCloseBta = React.createRef();
    this.footerCloseBtb = React.createRef();
    this.footerCloseBtc = React.createRef();

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
      totalRows:0,

      formAction:'',
      alertType:'primary',
      alertMessageStatus:false,
      alertMessage:'',
      setValidated:false
    };

    this.columns = [
      {
        name: 'Nome',
        selector: 'nome',
        sortable: true
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true
      },
      {
        name: 'Grupo',
        selector: 'grupo',
        sortable: true
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: false,
        cell: row => row.status === "Ativo" ? <Badge variant="success">Ativo</Badge> : <Badge variant="danger">Inativo</Badge>,
      },
      {
        name: 'Editar',
        selector: 'acoes',
        sortable: false,
        cell: row => <Button size='sm' onClick={() => this.openForm(!this.state.openFormAction, 'editar', row.id)}><MdEdit size={14} color="white" /></Button>
      },
      {
        name: 'Excluir',
        selector: 'acoes',
        sortable: false,
        cell: row => <Button variant='danger' size='sm' onClick={() => this.modalDelete(!this.state.openModalDelete, row.id)}><MdRemoveCircleOutline size={14} color="white" /></Button>
      },
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


  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value
      }
    );
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      // form is invalid! so we show error messages
      this.setState({ setValidated: true });
      return;
    }
    // form is valid! We can parse and submit data
    this.setState({ setValidated: false });

    const urlaction = this.state.formAction === 'incluir' ? this.config.appurl+"admin/usuarios/incluir" : this.config.appurl+"admin/usuarios/editar"
    
    const dataForm = {
      id:this.state.idusuario,
      nome:this.state.nome, 
      email:this.state.email,
      codigo_grupo: this.state.codigo_grupo,
      status: this.state.status,
      password: this.state.password,
      repassword:this.state.repassword,
      uemail:localStorage.getItem('email'), 
      usalt:localStorage.getItem('salt')
    };

    fetch(urlaction, {
      method: 'POST',
      body: JSON.stringify(dataForm),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(
      //loading
      this.setState(
        {
          alertMessageStatus: true,
          alertMessage:<ClipLoader size={28} color={"#2a3850"} />,
          alertType:'primary'
        }
      )
    )
    .then(
      (response) => {
        if(response.error){
          this.setState(
            {
              alertMessageStatus: true,
              alertMessage:ReactHtmlParser(response.message),
              alertType:'danger'
            }
          );
        }else{
          this.setState(
            {
              alertMessageStatus: true,
              alertMessage:ReactHtmlParser(response.message),
              alertType:'success'
            }
          );

          //limpar formulário
          //recarregar a tabela
          this.loadData();

          setTimeout(() => {
            this.setState({alertMessageStatus:false})
          }, 3000);
          
          if(this.state.formAction === 'incluir'){
            this.setState({
              idusuario: '',
              nome: '',
              email: '',
              codigo_grupo: '',
              status: 1,
              password: '',
              repassword: ''
            });
          }
         
        }
      },
      (error) => {
        this.setState({
          alertMessageStatus: true,
          alertMessage:"Ops aconteceu um erro na operação: "+error,
          alertType:'danger'
        });
      }
    )

  }


  loadData = () => {
    fetch(this.config.appurl+"admin/usuarios/listar",{
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
      )
  }

  loadGroups = () => {
    fetch(this.config.appurl+"admin/grupos/listar",{
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
            groups: result
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

  openForm = (open, action, id) =>{
    this.setState({ openFormAction:open, formAction:action })

    this.loadGroups();

    if(action === 'editar' && id){
      //se action for edit popular campos do formulário, senão limpar
      fetch(this.config.appurl+"admin/usuarios/buscarusuario",{
        method: 'POST',
        body: JSON.stringify({idusuario: id, uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              idusuario: result.id,
              nome: result.nome,
              email: result.email,
              codigo_grupo: result.codigo_grupo,
              status: result.status
            });
          },
          (error) => {
            this.setState({
              alertMessageStatus: true,
              alertMessage:"Ops aconteceu um erro na operação: "+error,
              alertType:'danger'
            });
          }
        )
      }else{
        this.setState({alertMessageStatus:false})
        this.setState({
          idusuario: '',
          nome: '',
          email: '',
          codigo_grupo: '',
          status: 1,
          password: '',
          repassword: ''
        });
      }
    
  }

  deleteItem = (id) =>{
    this.footerCloseBta.current.style.display = "block";
    this.footerCloseBtb.current.style.display = "none";
    this.footerCloseBtc.current.style.display = "none";

    if(id){
      fetch(this.config.appurl+"admin/usuarios/excluir", {
        method: 'POST',
        body: JSON.stringify({idusuario: id, uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(
        (response) => {

          if(response.error){
            this.setState(
              {
                alertMessageStatus: true,
                alertMessage:response.message,
                alertType:'danger'
              }
            )
          }else{
            this.setState(
              {
                alertMessageStatus: true,
                alertMessage:response.message,
                alertType:'success'
              }
            )
          }

          //limpar a sessão
          this.loadData();
         
        },(error) => {
          this.setState({
            alertMessageStatus: true,
            alertMessage:"Ops aconteceu um erro na operação: "+error,
            alertType:'danger'
          });
        }
      )
    }else{
      this.setState({
        alertMessageStatus: true,
        alertMessage:"Ops aconteceu um erro na operação: Não existe um id de usuário válido",
        alertType:'danger'
      });
    }

  }

  modalDelete = (open, id) => {
    this.setState({ openModalDelete:open, idUsuarioDelete:id })
    this.setState({alertMessageStatus:false})
    
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
    let grupos = [];

    if(this.state.logged === "yes"){

      //Load lista de grupos
      if(this.state.groups){
        for(let i = 0; i < this.state.groups.length; i++){
          grupos.push(<option key={this.state.groups[i].id} value={this.state.groups[i].id}>{this.state.groups[i].titulo}</option>)
        }
      }
     
      content = <div className="cover-container d-flex w-100 h-100 mx-auto flex-column">
          <Header
            toggleFullscreen={() => this.toggleFullscreen(!this.state.fullscreenOn)}
            openPerfil={() => this.openPerfil(!this.state.PerfilAction)}
            closeSair={() => this.closeSair(!this.state.sairAction)}
            openSobre={() => this.openSobre(!this.state.sobreAction)}
          />
          
          <Breadcrumbs pagetitle="Gerenciamento de Usuários" />

          <div className="main-content-inner">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="card">
                  <div className="card-body">
                      
                    <Navbar bg="light">
                      <Navbar.Brand href="#usuarios">Usuários</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />

                      <Navbar.Collapse style={{padding:'5px'}}>
                        <Nav className="ml-auto">

                          <Nav.Link onClick={() => this.openForm(!this.state.openFormAction, 'incluir', null)} style={{color:"green"}}>
                            <MdPersonAdd size={14} color="green" />
                            {" "}
                            Cadastrar Usuário
                          </Nav.Link>

                        </Nav>
                      </Navbar.Collapse>

                    </Navbar>

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
            show={this.state.openFormAction}
            onHide={() => this.openForm(!this.state.openFormAction)}
            backdrop="static"
            keyboard={true}
            >
            <Modal.Header closeButton>
            <Modal.Title>Formulário do Usuário</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={e => this.handleSubmit(e)} noValidate className={this.state.setValidated ? 'is-invalid was-validated form-control:invalid' : ''}>
                <Form.Control type="hidden" name="idusuario" defaultValue={ this.state.idusuario || ""} onChange={this.handleChange} />
                <Alert variant={this.state.alertType} show={this.state.alertMessageStatus} onClose={() => this.closeAlertMessage()} dismissible>
                  {this.state.alertMessage}
                </Alert>

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" placeholder="Nome do Usuário" name="nome" value={this.state.nome || ""} onChange={this.handleChange} required />
                      <Form.Control.Feedback type="invalid">
                        Insira o nome do usuário
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Email do Usuário" name="email" value={this.state.email || ""} onChange={this.handleChange} required />
                      <Form.Control.Feedback type="invalid">
                        Insira um email válido para o usuário
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>
                
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Grupo</Form.Label>
                      <Form.Control as="select" value={this.state.codigo_grupo || ''} name="codigo_grupo" onChange={this.handleChange} required>
                        <option disabled hidden value=''>Selecione um grupo de usuários</option>
                        {grupos.length > 0 ? grupos : <option>Não foi possível listar os grupos</option> }
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Selecione o grupo do usuário
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Control as="select" value={this.state.status || ''} name="status" onChange={this.handleChange} required>
                        <option disabled hidden value=''>Defina um status</option>
                        <option value="1">Ativo</option>
                        <option value="2">Inativo</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Defina o status do usuário
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Senha</Form.Label>
                      <Form.Control type="password" placeholder="Senha" name="password" value={this.state.password || ""} onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        Insira uma senha que possua 6 até 14 dígitos
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Repetir a senha</Form.Label>
                      <Form.Control type="password" placeholder="Repita a senha" name="repassword" value={this.state.repassword || ""} onChange={this.handleChange} />
                      <Form.Control.Feedback type="invalid">
                        Repita a senha digitada
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>

                <Button variant="primary" type="submit" block>
                  Salvar
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => this.openForm(!this.state.openFormAction)}>
                Fechar
            </Button>

            </Modal.Footer>
          </Modal>

          <Modal
              show={this.state.openModalDelete}
              onHide={() => this.modalDelete(!this.state.openModalDelete, null)}
              backdrop="static"
              keyboard={true}
          >
              <Modal.Header closeButton>
                <Modal.Title>Deseja mesmo excluir o usuário?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Alert variant={this.state.alertType} show={this.state.alertMessageStatus} onClose={() => this.closeAlertMessage()} dismissible>
                  {this.state.alertMessage}
                </Alert>
                <p><strong>Obs: Não será possível reverter esta ação</strong></p>
                </Modal.Body>
              <Modal.Footer>
                <Button style={{display:"none"}} id="footerCloseBta" ref={this.footerCloseBta} variant="primary" onClick={() => this.modalDelete(!this.state.openModalDelete, null)}>
                  Fechar
                </Button>
                <Button id="footerCloseBtb" ref={this.footerCloseBtb} variant="primary" onClick={() => this.modalDelete(!this.state.openModalDelete, null)}>
                    Não
                </Button>
                <Button id="footerCloseBtc" ref={this.footerCloseBtc} variant="danger" onClick={() => this.deleteItem(this.state.idUsuarioDelete)}>
                    Sim
                </Button>
              </Modal.Footer>
            
          </Modal>

      </div>;


    }else if(this.state.logged === "loading"){
      content = <PageLoading />;
    }else{
      content = <Redirect push to="/"/>;
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

export default Usuarios;



