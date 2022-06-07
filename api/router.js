const express = require('express')
const cors = require('cors')
const app = express();


//Admin Api
const admin = require('./admin/admin');
const usuarios = require('./admin/usuarios');
const grupos = require('./admin/grupos');
const emailserver = require('./admin/emailserver')
const urls = require('./admin/urls')
const categorias = require('./admin/categorias')
const logs = require('./admin/logs')
const cub = require('./admin/cub')
const integracoes = require('./admin/integracoes')
const transmissoes = require('./geoportal/transmissoes')

//Geoportal Api
const geoportal = require('./geoportal/app');

app.use(express.json());
app.use(cors());

//Rotas Dashboard/Geoportal/Login
app.post('/geoportal/dologin', geoportal.DoLogin);
app.post('/geoportal/logged', geoportal.Logged);
app.post('/geoportal/logout', geoportal.DoLogout);

//Rotas Admin
app.post('/admin/dologin', admin.DoLogin);
app.post('/admin/logged', admin.Logged);
app.post('/admin/logout', admin.DoLogout);

//Rotas Usuário
app.post('/admin/dologin', geoportal.DoLogin);
app.post('/admin/usuarios/listar', usuarios.ListarUsuarios);
app.post('/admin/usuarios/buscarusuario', usuarios.BuscarUsuario);
app.post('/admin/usuarios/excluir', usuarios.ExcluirUsuario);
app.post('/admin/usuarios/incluir', usuarios.IncluirUsuario);
app.post('/admin/usuarios/editar', usuarios.EditarUsuario);
app.post('/admin/usuarios/buscarperfil', usuarios.BuscarPerfil);
app.post('/admin/usuarios/editarperfil', usuarios.EditarPerfil);
app.post('/admin/usuarios/recuperarsenha', usuarios.RecuperarSenha);

//Rotas Grupos
app.post('/admin/grupos/listar', grupos.ListarGrupos);
app.post('/admin/grupos/buscargrupo', grupos.BuscarGrupo);
app.post('/admin/grupos/incluir', grupos.IncluirGrupo);
app.post('/admin/grupos/excluir', grupos.ExcluirGrupo);
app.post('/admin/grupos/editar', grupos.EditarGrupo);
//Rotas Permissões
app.post('/admin/permissoes/listar', grupos.ListarPermissoes);
app.post('/admin/permissoes/incluir', grupos.IncluirPermissao);
app.post('/admin/permissoes/excluir', grupos.ExcluirPermissao);

//Rotas Configurações
app.post('/admin/emailserver/buscar', emailserver.BuscarEmailServer);
app.post('/admin/emailserver/editar', emailserver.EditarEmailServer);

//Rotas Urls
app.post('/admin/urls/listar', urls.Listar);
app.post('/admin/urls/incluir', urls.Incluir);
app.post('/admin/urls/editar', urls.Editar);
app.post('/admin/urls/excluir', urls.Excluir);

//Rotas Categorias
app.post('/admin/categorias/listar', categorias.Listar);
app.post('/admin/categorias/incluir', categorias.Incluir);
app.post('/admin/categorias/editar', categorias.Editar);
app.post('/admin/categorias/excluir', categorias.Excluir);

//Cub
app.post('/admin/cub/listar', cub.Listar);
app.post('/admin/cub/incluir', cub.Incluir);
app.post('/admin/cub/editar', cub.Editar);
app.post('/admin/cub/excluir', cub.Excluir);

//Rotas Logs
app.post('/admin/logs/listar', logs.Listar);
app.post('/admin/logs/exportar', logs.Exportar);

//Rotas Integracao
app.post('/admin/urls/listar', urls.Listar);

//Rotas Transmissões
app.post('/geoportal/transmissoes', transmissoes.Transmissoes);


module.exports = app;
