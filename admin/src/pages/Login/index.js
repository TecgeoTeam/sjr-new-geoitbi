import React from 'react';
import {Form, Button, Col, Modal, Alert, Toast}  from "react-bootstrap";
import ClipLoader from "react-spinners/BarLoader";
import BackgroundSlider from 'react-background-slider';
import {Redirect} from "react-router-dom";
import randomstring from "randomstring";
import enc2 from "crypto-js/sha256"
import ReactHtmlParser from 'react-html-parser';
import './style.css';
import Config from '../../config';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      logged:false,
      setToast:false,
      messageToast:'',
      classToast:'',
      setValidated:false,
      setRecValidated:false,
      email: '',
      password: '',

      openFormRecSenhaAction:false,
      alertType:'primary',
      alertMessageStatus:false,
      alertMessage:'',
    };

    //Configuracoes
    this.config = Config.configs()

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

    //const data = new FormData(event.target);
    let token = enc2(randomstring.generate() + Date.now()).toString()
    localStorage.setItem('email', this.state.email);
    localStorage.setItem('salt', token);

    const dataLogin = {
      email:this.state.email, //data.get('email'),
      password:this.state.password, //data.get('password')
      salt:token
    }

    fetch(this.config.appurl+"admin/dologin", {
      method: 'POST',
      body: JSON.stringify(dataLogin),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(
      //loading
      this.setState(
        {
          setToast: true,
          messageToast:<ClipLoader size={28} color={"#2a3850"} />,
          classToast:'toastMsg alert alert-primary'
        }
      )
    )
    .then(
      (response) => {
        if(response.error){
          this.setState(
            {
              setToast: true,
              messageToast: ReactHtmlParser(response.message),
              classToast:'toastMsg alert alert-danger'
            }
          );
        }else{
          this.setState(
            {
              setToast: true,
              messageToast:<span>{ReactHtmlParser(response.message)} <br/><br/> <ClipLoader size={28} color={"green"}/></span> ,
              classToast:'toastMsg alert alert-success',
              logged:true
            }
          );
          //Exibir o nome do usuário
          localStorage.setItem('nome', response.nome);
        }
      },
      (error) => {
        this.setState({
          setToast: true,
          messageToast:"Ops ocorreu um erro: "+error,
          classToast:'toastMsg alert alert-danger'
        });
      }
    )

    //const responseLogin = await sendLogin.json();

  }

  handleRecSenhaSubmit = async (event) => {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      // form is invalid! so we show error messages
      this.setState({ setRecValidated: true });
      return;
    }
    // form is valid! We can parse and submit data
    this.setState({ setRecValidated: false });

    const dataRec = {
      email_recuperacao:this.state.email_recuperacao
    }

    fetch(this.config.appurl+"admin/usuarios/recuperarsenha", {
      method: 'POST',
      body: JSON.stringify(dataRec),
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

  openFormRecSenha = (action) =>{
    this.setState({ openFormRecSenhaAction: action })
  }

  closeToast = () => {
    this.setState(
      {
        setToast: false
      }
    );
  }

  closeAlertMessage = () => {
    this.setState(
      {
        alertMessageStatus: false
      }
    );
  }

  render() {
    
    if(this.state.logged){
      return (
        <Redirect push to="/dashboard" />
      )
    }else{
     
      return (
        <>
          <Toast onClose={() => this.closeToast()} show={this.state.setToast} delay={5000} autohide className={this.state.classToast} >
            <Toast.Header>
              <strong className="mr-auto">Mensagem</strong>
            </Toast.Header>
            <Toast.Body><strong>{this.state.messageToast} </strong></Toast.Body>
          </Toast>
          
          <BackgroundSlider images={["/sjr1.jpg", "/sjr3.jpg", "/sjr2.jpg"]} duration={5} transition={2} />

          <section className="container-fluid p-2">
            <form onSubmit={this.handleSubmit} noValidate className={this.state.setValidated ? 'form-signin text-center is-invalid was-validated form-control:invalid' : 'form-signin text-center'}>
              <img 
                src="/logo.png" 
                alt="Logo SJR"
                width="111"
                height="164"
                className="mb-4 d-inline-block align-center"
              />
              <h2 className="h3 mb-3 font-weight-normal">Login Administrativo</h2>
              
              <input type="email" className="form-control" name="email" value={this.state.value} onChange={this.handleChange} placeholder="Email do Usuário" required />
              <Form.Control.Feedback type="invalid">
                Por favor insira um email válido
              </Form.Control.Feedback>
              
              <input type="password" id="inputPassword" className="form-control" name="password" value={this.state.value} onChange={this.handleChange} placeholder="Senha do Usuário" required />
              <Form.Control.Feedback type="invalid">
                Insira sua senha de usuário
              </Form.Control.Feedback>

              <hr/>
              <div className="checkbox mb-3 mt-1">
                  <p>
                    <a className="text-danger" href="#per" onClick={() => this.openFormRecSenha(!this.state.openFormRecSenhaAction)}>Pedeu a senha?</a>
                  </p>
              </div>
              <button className="btn btn-lg btn-danger btn-block" type="submit">Acessar</button>
              <hr/>
              <p>&copy; {new Date().getFullYear()} - Prefeitura Municipal de São José de Ribamar |
                  <a className="text-danger" href="http://tecgeobr.com.br" rel="noopener noreferrer" target="_blank"> Desenvolvimento Tecgeo</a>.
              </p>
            </form>
          </section>
         
  
          <Modal
            show={this.state.openFormRecSenhaAction}
            onHide={() => this.openFormRecSenha(!this.state.openFormRecSenhaAction)}
            backdrop="static"
            keyboard={true}
            >
            <Modal.Header closeButton>
              <Modal.Title>Recuperar Senha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={e => this.handleRecSenhaSubmit(e)} noValidate className={this.state.setRecValidated ? 'is-invalid was-validated form-control:invalid' : ''}>
               
                <Alert variant={this.state.alertType} show={this.state.alertMessageStatus} onClose={() => this.closeAlertMessage()} dismissible>
                  {this.state.alertMessage}
                </Alert>

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Email do Usuário</Form.Label>
                      <Form.Control type="email" placeholder="Insira o email do usuário" name="email_recuperacao" value={this.state.email_recuperacao || ""} onChange={this.handleChange} required />
                      <Form.Control.Feedback type="invalid">
                        Insira o email do usuário que deseja recuperar a senha
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>

                <Button variant="danger" type="submit" block>
                  Recuperar
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => this.openFormRecSenha(!this.state.openFormRecSenhaAction)}>
                Fechar
            </Button>

            </Modal.Footer>
          </Modal>
    
        </>
      );
    }
 
     
  }
}

export default Login;
