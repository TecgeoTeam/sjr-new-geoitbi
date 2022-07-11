import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Config from '../../config';
import './style.css';

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

        fetch(this.config.appurl+"admin/logout", {
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
              <Redirect push to="/geoitbi_admin" />
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
                        <Modal.Title>Deseja mesmo Sair?</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Footer>
                        <Button variant="secondary" onClick={e => this.props.closeSair(e)}>
                            Não
                        </Button>
                        <Button variant="danger" onClick={e => this.handleLogout()}>
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


