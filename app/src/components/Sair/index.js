import React from 'react';
import {Modal, Button}  from "react-bootstrap";
import './style.css'
import { Redirect } from "react-router-dom";
import Config from '../../config';


class Sair extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            logged:true
        }

        this.handleLogout = this.handleLogout.bind(this);

        //Configuracoes
        this.config = Config.configs()
    }

    handleLogout = async () => {

        fetch(this.config.appurl+"geoportal/logout", {
          method: 'POST',
          body: JSON.stringify({email:localStorage.getItem('email'), salt:localStorage.getItem('salt')}),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(
          (response) => {
            console.log(response)
            this.setState(
                {
                    logged: false
                }
            )
            //limpar a sessão
            localStorage.clear();
           
          }
        )
    
      }

    render() {

        if(!this.state.logged){
            return (
              <Redirect push to="/" />
            )
        }else{
    
            return (
                <>
                    <Modal
                        show={true}
                        onHide={e => this.props.closeSair(e)}
                        backdrop="static"
                        keyboard={true}
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Deseja mesmo Sair do Geoportal?</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Footer>
                        <Button variant="secondary" onClick={e => this.props.closeSair(e)}>
                            Não
                        </Button>
                        <Button variant="primary" onClick={e => this.handleLogout()}>
                            Sim
                        </Button>
                        
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }
    }  
}


export default Sair;


