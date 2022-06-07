import React from 'react';
import { Redirect  } from "react-router-dom";
import {Form, Button, Col, Alert}  from "react-bootstrap";

import Perfil from '../../components/Perfil';
import Sobre from '../../components/Sobre';
import Sair from '../../components/Sair';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import PageLoading from '../../components/PageLoading';
import Config from '../../config';
import './style.css';

class Integracoes extends React.Component {

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
      formAction:'',
      alertType:'primary',
      alertMessageStatus:false,
      alertMessage:'',
      setValidated:false
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
          this.openForm()
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
    /*
    // form is valid! We can parse and submit data
    this.setState({ setValidated: false });
    
    const dataForm = {
      id:this.state.id,
      hostname:this.state.hostname, 
      email:this.state.email,
      smtp_port: this.state.smtp_port,
      host_password: this.state.host_password,
      default_message: this.state.default_message,
      send_email1: this.state.send_email1,
      send_email2: this.state.send_email2,
      send_email3: this.state.send_email3,
      send_email4: this.state.send_email4,
      uemail:localStorage.getItem('email'), 
      usalt:localStorage.getItem('salt')
    };

    fetch(this.config.appurl+"admin/emailserver/editar", {
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


          setTimeout(() => {
            this.setState({alertMessageStatus:false})
          }, 3000);
          

        }
      },
      (error) => {
        this.setState({
          alertMessageStatus: true,
          alertMessage:"Ops aconteceu um erro na operação: "+error,
          alertType:'danger'
        });
      }
    )*/

  }


  openForm = () =>{
    /*
      //se action for edit popular campos do formulário, senão limpar
      fetch("http://187.19.152.191:6010/admin/emailserver/buscar",{
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
            id:result.id,
            hostname:result.hostname, 
            email:result.email,
            smtp_port: result.smtp_port,
            host_password: result.host_password,
            default_message: result.default_message,
            send_email1: result.send_email1,
            send_email2: result.send_email2,
            send_email3: result.send_email3,
            send_email4: result.send_email4
          });
        },
        (error) => {
          this.setState({
            alertMessageStatus: true,
            alertMessage:"Ops aconteceu um erro na operação: "+error,
            alertType:'danger'
          });
        }
      )*/
     
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
          
          <Breadcrumbs pagetitle="Integrações / Migrações" />

          <div className="main-content-inner">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="card">
                  <div className="card-body">
                      
                    <Form onSubmit={e => this.handleSubmit(e)} noValidate className={this.state.setValidated ? 'is-invalid was-validated form-control:invalid' : ''}>
                      <Form.Control type="hidden" name="id" defaultValue={ this.state.id || ""} onChange={this.handleChange} />
                      
                      <Alert variant={this.state.alertType} show={this.state.alertMessageStatus} onClose={() => this.closeAlertMessage()} dismissible>
                        {this.state.alertMessage}
                      </Alert>

                      <Form.Row>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch1"
                            label="Segunda-Feira"
                          />
                        </Col>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch2"
                            label="Terça-Feira"
                          />
                        </Col>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch3"
                            label="Quarta-Feira"
                          />
                        </Col>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch4"
                            label="Quinta-Feira"
                          />
                        </Col>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch5"
                            label="Sexta-Feira"
                          />
                        </Col>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch5"
                            label="Sábado"
                          />
                        </Col>
                        <Col sm={12}>
                          <Form.Check 
                            type="switch"
                            id="custom-switch5"
                            label="Domingo"
                          />
                        </Col>
                       
                      </Form.Row>
                      <hr/>
                      <Form.Row>
                        
                        <Col>
                          <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label>Horário de Execução Automática (Diária)</Form.Label>
                            <Form.Control as="select" custom>
                              <option>17:00</option>
                              <option>18:00</option>
                              <option>19:00</option>
                              <option>22:00</option>
                              <option>05:00</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        
                      </Form.Row>
                    
                      <Button variant="danger" type="submit" block>
                        Salvar
                      </Button>
                    </Form>

                  </div>
                </div>
              </div>
            </div>
          </div>

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

export default Integracoes;



