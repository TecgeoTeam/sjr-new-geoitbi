import React from 'react';
import { Redirect  } from "react-router-dom";
import {Form, Button, Col, Alert, OverlayTrigger, Tooltip}  from "react-bootstrap";
import ClipLoader from "react-spinners/BarLoader";
import ReactHtmlParser from 'react-html-parser';
import PageLoading from '../../components/PageLoading';
import WidgetLoading from '../../components/WidgetLoading';
import Config from '../../config';

import DataTable from 'react-data-table-component';
import {MdRemoveCircleOutline, MdInfoOutline} from 'react-icons/md';
import './style.css';

class Permissoes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      logged: "loading",
      error: null,
      isLoaded: true,
      tableData: [],
      tableResources: [],
      totalRows:0,

      alertType:'primary',
      alertMessageStatus:false,
      alertMessage:'',
      setValidated:false
    };

    this.columns = [
      {
        name: 'Recurso',
        selector: 'recurso',
        sortable: true,
        cell: row => <OverlayTrigger placement={'top'} overlay={<Tooltip>{row.alias} | {row.tipo}</Tooltip>}><strong><MdInfoOutline size={16} color="#4e51d6" /> {row.recurso}</strong></OverlayTrigger>
      },
      {
        name: 'Excluir',
        selector: 'codigo',
        sortable: false,
        cell: row => <Button variant='danger' size='sm' onClick={() => this.deleteItem(row.codigo)}><MdRemoveCircleOutline size={14} color="white" /></Button>
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
          this.loadData(this.props.group);

        }
      }
    )
  }

  loadData = (grupo) => {
    fetch(this.config.appurl+"admin/permissoes/listar",{
      method: 'POST',
      body: JSON.stringify({idgrupo:grupo, uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
         
          this.setState({
            isLoaded: false,
            tableData: result.acls,
            tableResources:result.resources
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

  handleChange = (event) => {
    let setAlias;

    if(this.state.tableResources){
      for(let i = 0; i < this.state.tableResources.length; i++){
        if(this.state.tableResources[i].recurso === event.target.value){
          setAlias = this.state.tableResources[i].alias
        }
      }
    }

    this.setState(
      {
        [event.target.name]: event.target.value,
        alertMessageStatus: true,
        alertMessage: setAlias,
        alertType:'info'
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

    const dataForm = {
      codigo_grupo:this.props.group,
      codigo_recurso:this.state.recurso,
      uemail:localStorage.getItem('email'),
      usalt:localStorage.getItem('salt')
    };

    fetch(this.config.appurl+"admin/permissoes/incluir", {
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
          this.loadData(this.props.group);
          this.setState({recurso:''})

          setTimeout(() => {
            this.setState({alertMessageStatus:false})
          }, 1000);
          
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

  deleteItem = (id) =>{

    if(id){
      fetch(this.config.appurl+"admin/permissoes/excluir", {
        method: 'POST',
        body: JSON.stringify({codigo: id, grupo:this.props.group, uemail:localStorage.getItem('email'), usalt:localStorage.getItem('salt')}),
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
          this.loadData(this.props.group);
          this.setState({recurso:''})

          setTimeout(() => {
            this.setState({alertMessageStatus:false})
          }, 1000);
          
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

      let resources = []
      if(this.state.tableResources){
        for(let i = 0; i < this.state.tableResources.length; i++){
          resources.push(
            <option 
              key={this.state.tableResources[i].codigo} 
              value={this.state.tableResources[i].recurso}>
              {this.state.tableResources[i].recurso + " | " + this.state.tableResources[i].alias + " | " + this.state.tableResources[i].tipo}
            </option>
          )
        }
      }
     
      content = <div className="cover-container d-flex w-100 h-100 mx-auto flex-column">
        
          <p>
            <strong>Selecione os recursos ou ações que o grupo terá permissão de acesso e operação</strong>
          </p>
          
          <div className="main-content-inner">
            <div className="row">
            <div className="col-12">
              <Form onSubmit={e => this.handleSubmit(e)} noValidate className={this.state.setValidated ? 'is-invalid was-validated form-control:invalid' : ''}>
                
                <Alert variant={this.state.alertType} show={this.state.alertMessageStatus} onClose={() => this.closeAlertMessage()} dismissible>
                  {this.state.alertMessage}
                </Alert>
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Recursos</Form.Label>
                      <Form.Control as="select" value={this.state.recurso || ''} name="recurso" onChange={this.handleChange} required>
                        <option disabled hidden value=''>Selecione um recurso</option>
                        {resources.length > 0 ? resources : <option>Não foi possível listar os recursos</option> }
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Selecione um recurso
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Button variant="primary" type="submit" block>
                  Incluir
                </Button>
              </Form>
              </div>
              <hr/>


              <div className="col-12">
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

      </div>;


    }else if(this.state.logged === "loading"){
      content = <PageLoading />;
    }else{
      content = <Redirect push to="/"/>;
    }

    return (
      <>
        {content}
      </>
    );
    

  }
}

export default Permissoes;



