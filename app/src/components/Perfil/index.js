import React from 'react';
import {Modal, Button, Form, Col, Alert}  from "react-bootstrap";
import ClipLoader from "react-spinners/BarLoader";
import ReactHtmlParser from 'react-html-parser';
import './style.css'
import Config from '../../config';

class Perfil extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          logged: "loading",
          error: null,
          isLoaded: true,
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

    loadData = () =>{
        //this.setState({ openFormAction:open, formAction:action })

        //se action for edit popular campos do formulário, senão limpar
        fetch(this.config.appurl+"admin/usuarios/buscarperfil",{
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
                    id: result.id,
                    nome: result.nome,
                    email: result.email,
                    perfil: result.perfil
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
        
        const dataForm = {
          id:this.state.id,
          nome:this.state.nome, 
          email:this.state.email,
          perfil:this.state.perfil,
          password: this.state.password,
          repassword:this.state.repassword,
          uemail:localStorage.getItem('email'), 
          usalt:localStorage.getItem('salt')
        };
    
        fetch(this.config.appurl+"admin/usuarios/editarperfil", {
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
        )
    
    }

    closeAlertMessage = () => {
        this.setState(
            {
            alertMessageStatus: false
            }
        );
    }

    render() {
    
        return (
            <>
                <Modal
                    show={true}
                    onHide={e => this.props.openPerfil(e)}
                    backdrop="static"
                    keyboard={true}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Perfil</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <Form onSubmit={e => this.handleSubmit(e)} noValidate className={this.state.setValidated ? 'is-invalid was-validated form-control:invalid' : ''}>
                        <Form.Control type="hidden" name="id" defaultValue={ this.state.id || ""} onChange={this.handleChange} />
                        
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
                                        <Form.Label>Sobre</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder="Sobre" name="perfil" defaultValue={this.state.perfil || ""} onChange={this.handleChange} />
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
                    <Button variant="secondary" onClick={e => this.props.openPerfil(e)}>
                        Fechar
                    </Button>
                    
                    </Modal.Footer>
                </Modal>
            </>
        );
    }  
}


export default Perfil;


