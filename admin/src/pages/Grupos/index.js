import React from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Nav, Navbar } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import ReactHtmlParser from 'react-html-parser';
import { MdEdit, MdGroupAdd, MdRemoveCircleOutline } from 'react-icons/md';
import { Redirect } from "react-router-dom";
import ClipLoader from "react-spinners/BarLoader";
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

class Grupos extends React.Component {
  
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
      openModalPermissoes:false,
      totalRows:0,

      formAction:'',
      alertType:'primary',
      alertMessageStatus:false,
      alertMessage:'',
      setValidated:false
    };

    this.columns = [
      {
        name: 'Grupo',
        selector: 'titulo',
        sortable: true
      },
      {
        name: 'Descrição',
        selector: 'descricao',
        sortable: false
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: false,
        cell: row => row.status === "Ativo" ? <Badge variant="success">Ativo</Badge> : <Badge variant="danger">Inativo</Badge>,
      },
      {
        name: 'Permissões',
        selector: 'acoes',
        sortable: false,
        cell: row => <Button variant='success' size='sm' onClick={() => this.modalPermissoes(!this.state.openModalPermissoes, row.id)}>Permissões</Button>
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

    const urlaction = this.state.formAction === 'incluir' ? this.config.appurl+"admin/grupos/incluir" : this.config.appurl+"admin/grupos/editar"
    
    const dataForm = {
      id:this.state.idgrupo,
      titulo:this.state.titulo, 
      descricao:this.state.descricao,
      status: this.state.status,
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
              idgrupo: '',
              titulo: '',
              descricao: '',
              status: 1
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


  openForm = (open, action, id) =>{
    this.setState({ openFormAction:open, formAction:action })

    if(action === 'editar' && id){
      //se action for edit popular campos do formulário, senão limpar
      fetch(this.config.appurl+"admin/grupos/buscargrupo",{
        method: 'POST',
        body: JSON.stringify({idgrupo: id, uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              idgrupo: result.id,
              titulo: result.titulo,
              descricao: result.descricao,
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
          idgrupo: '',
          titulo: '',
          descricao: '',
          status: 1
        });
      }
    
  }

  deleteItem = (id) =>{
    this.footerCloseBta.current.style.display = "block";
    this.footerCloseBtb.current.style.display = "none";
    this.footerCloseBtc.current.style.display = "none";

    if(id){
      fetch(this.config.appurl+"admin/grupos/excluir", {
        method: 'POST',
        body: JSON.stringify({idgrupo: id, uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
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
    this.setState({ openModalDelete:open, idgrupoDelete:id })
    this.setState({alertMessageStatus:false})
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
          
          <Breadcrumbs pagetitle="Grupos e Permissões de Usuários" />

          <div className="main-content-inner">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="card">
                  <div className="card-body">
                      
                    <Navbar bg="light">
                      <Navbar.Brand href="#grupos">Grupos</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />

                      <Navbar.Collapse style={{padding:'5px'}}>
                        <Nav className="ml-auto">

                          <Nav.Link onClick={() => this.openForm(!this.state.openFormAction, 'incluir', null)} style={{color:"green"}}>
                            <MdGroupAdd size={14} color="green" />
                            {" "}
                            Cadastrar Grupo
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
            <Modal.Title>Formulário do Grupo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={e => this.handleSubmit(e)} noValidate className={this.state.setValidated ? 'is-invalid was-validated form-control:invalid' : ''}>
                <Form.Control type="hidden" name="idgrupo" defaultValue={ this.state.idgrupo || ""} onChange={this.handleChange} />
                <Alert variant={this.state.alertType} show={this.state.alertMessageStatus} onClose={() => this.closeAlertMessage()} dismissible>
                  {this.state.alertMessage}
                </Alert>

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Título do Grupo</Form.Label>
                      <Form.Control type="text" placeholder="Título do Grupo" name="titulo" value={this.state.titulo || ""} onChange={this.handleChange} required />
                      <Form.Control.Feedback type="invalid">
                        Insira o Título do Grupo
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="Descrição do Grupo" name="descricao" defaultValue={this.state.descricao || ""} onChange={this.handleChange} required />
                      <Form.Control.Feedback type="invalid">
                        Escreva uma  descrição para o grupo
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row> 

                <Form.Row>
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
                <Modal.Title>Deseja mesmo excluir o grupo?</Modal.Title>
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
                <Button id="footerCloseBtc" ref={this.footerCloseBtc} variant="danger" onClick={() => this.deleteItem(this.state.idgrupoDelete)}>
                    Sim
                </Button>
              </Modal.Footer>
            
          </Modal>

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

export default Grupos;



