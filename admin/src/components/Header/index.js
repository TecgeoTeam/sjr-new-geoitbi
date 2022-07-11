import React from 'react';
import { Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaBook, FaHome, FaInfoCircle, FaLink, FaUserCircle } from "react-icons/fa";
import { MdAspectRatio, MdAttachMoney, MdClose, MdEmail, MdExitToApp, MdFileUpload, MdGroup, MdMenu } from 'react-icons/md';
import './style.css';


class Header extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          username:localStorage.getItem('nome')
        };

        this.mobileMenuPanel = React.createRef();
        this.mobileMenuPanelBtnOpen = React.createRef();
        this.mobileMenuPanelBtnClose = React.createRef();
    }

    showMobileMenu = () =>{
        this.mobileMenuPanel.current.style.display = "block";
        this.mobileMenuPanelBtnOpen.current.style.display = "none";
        this.mobileMenuPanelBtnClose.current.style.display = "block";
    }

    closeMobileMenu = () =>{
        this.mobileMenuPanel.current.style.display = "none";
        this.mobileMenuPanelBtnOpen.current.style.display = "block";
        this.mobileMenuPanelBtnClose.current.style.display = "none";
    }

    render() {
    
        return (
            <>
                <Navbar bg="danger" variant="dark">
                    <Navbar.Brand onClick={ function retFalse(){return false} } >
                        <img 
                            src="/geoitbi_admin/logo.png" 
                            alt="Logo PMJG"
                            width="32"
                            height="42"
                            className="d-inline-block align-center"
                        />
                        {' '}
                        Admin | GeoITBI
                    </Navbar.Brand>
                    
                    <Nav className="mr-auto defaultMenu">
                        <NavDropdown title={this.state.username} id="collasible-nav-dropdown">
                            <NavDropdown.Item onClick={e => this.props.openPerfil(e)}><FaUserCircle size={16} color="#e31b1b" /> Meu Perfil</NavDropdown.Item>
                            <NavDropdown.Item onClick={e => this.props.closeSair(e)}><MdExitToApp size={16} color="#e31b1b" /> Sair da Aplicação</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={e => this.props.openSobre(e)}><FaInfoCircle size={16} color="#e31b1b" /> Sobre</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ml-auto defaultMenu">
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Início</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/dashboard">
                                <FaHome size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Usuários</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/usuarios">
                                <FaUserCircle size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Grupos</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/grupos">
                                <MdGroup size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Servidor de Email</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/servidoremail">
                                <MdEmail size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>URLs</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/urls">
                                <FaLink size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>CUB</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/cub">
                                <MdAttachMoney size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Logs do Sistema</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/logs">
                                <FaBook size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Integrações</Tooltip>}>
                            <Nav.Link className="btnMenu" href="/geoitbi_admin/integracoes">
                                <MdFileUpload size={18} color="#fafafa" />
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement={'left'} overlay={<Tooltip>Ampliar Tela</Tooltip>}>
                            <Nav.Link className="btnMenu" onClick={e => this.props.toggleFullscreen(e)}><MdAspectRatio size={18} color="#fafafa" /></Nav.Link>
                        </OverlayTrigger>
                        {' '}
                        
                    </Nav>

                    <Nav className="ml-auto mobileMenu">
                        <Nav.Link className="btnMenu" onClick={e => this.showMobileMenu(e)} id="mobileMenuPanelBtnOpen" ref={this.mobileMenuPanelBtnOpen}>
                            <MdMenu size={18} color="#fafafa" />
                        </Nav.Link>
                        <Nav.Link className="btnMenu" onClick={e => this.closeMobileMenu(e)} id="mobileMenuPanelBtnClose" ref={this.mobileMenuPanelBtnClose}>
                            <MdClose size={18} color="#fafafa"/>
                        </Nav.Link>
                    </Nav>
                
                </Navbar>

                <section id="mobileMenuPanel" ref={this.mobileMenuPanel} className="sidenav100">
                    <NavDropdown.Item href="/geoitbi_admin/dashboard"><FaHome size={16} color="#e31b1b" /> Início</NavDropdown.Item>
                    <NavDropdown.Item href="/geoitbi_admin/usuarios"><FaUserCircle size={16} color="#e31b1b" /> Usuários</NavDropdown.Item>
                    <NavDropdown.Item href="/geoitbi_admin/grupos"><MdGroup size={16} color="#e31b1b" /> Grupos</NavDropdown.Item>
                    <NavDropdown.Item href="/geoitbi_admin/servidoremail"><MdEmail size={16} color="#e31b1b" /> Servidor de Emails</NavDropdown.Item>
                    <NavDropdown.Item href="/geoitbi_admin/urls"><FaLink size={16} color="#e31b1b" /> URLs</NavDropdown.Item>
                    <NavDropdown.Item href="/geoitbi_admin/cub"><MdAttachMoney size={16} color="#e31b1b" /> CUB</NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/geoitbi_admin/logs"><FaBook size={16} color="#e31b1b" /> Logs do Sistema</NavDropdown.Item>
                    <NavDropdown.Item href="/geoitbi_admin/integracoes"><MdFileUpload size={16} color="#e31b1b" /> Integrações</NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={e => this.props.openPerfil(e)}><FaUserCircle size={16} color="#e31b1b" /> {this.state.username} (Ver Perfil)</NavDropdown.Item>
                    <NavDropdown.Item onClick={e => this.props.closeSair(e)}><MdExitToApp size={16} color="#e31b1b" /> Sair da Aplicação</NavDropdown.Item>
                    <NavDropdown.Item onClick={e => this.props.openSobre(e)}><FaInfoCircle size={16} color="#e31b1b" /> Sobre</NavDropdown.Item>
                  
                </section>
            </>
        );
    }  
}


export default Header;


