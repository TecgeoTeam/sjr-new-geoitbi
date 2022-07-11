import React from 'react';
import { Button, Modal } from "react-bootstrap";
import './style.css';

class Sobre extends React.Component {

    /*constructor(props) {
        super(props);
    }*/

    render() {
    
        return (
            <>
                <Modal
                    show={true}
                    onHide={e => this.props.openSobre(e)}
                    backdrop="static"
                    keyboard={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Sobre</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <h5>Geoportal de ITBI da Prefeitura Municipal de São José de Ribamar</h5>
                        <a href="https://www.saojosederibamar.ma.gov.br/" rel="noopener noreferrer" target="_blank">
                            <img src="/geoitbi_admin/logoHeader.png" width="100" height="150" alt="logo sjr"/>
                        </a>

                        <p className="p-2">
                            Este é o módulo administrativo do Geoportal de ITBI 
                            um ambiente controlado e específico para o gerenciamento e análise
                            dos recursos do geoportal.
                        </p>
                        <hr/>
                       
                        <h6> <strong>Desenvolvimento:</strong> <a href="http://tecgeobr.com.br" target="_blank" rel="noopener noreferrer">Tecgeo | Tecnologia em Geoprocessamento.</a></h6>
                        <a href="http://tecgeobr.com.br" target="_blank" rel="noopener noreferrer">
                            <img src="/geoitbi_admin/logoTecgeo.png" alt="logo tecgeo"/>
                        </a>

                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={e => this.props.openSobre(e)}>
                        Fechar
                    </Button>
                    
                    </Modal.Footer>
                </Modal>
            </>
        );
    }  
}


export default Sobre;