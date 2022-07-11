import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CubPage from './pages/Cub';
import DashboardPage from './pages/Dashboard';
import EmailServerPage from './pages/EmailServer';
import GruposPage from './pages/Grupos';
import Integracoes from './pages/Integracoes';
import LoginPage from './pages/Login';
import LogsPage from './pages/LogsSistema';
import NotFoundPage from './pages/NotFound';
import UrlsPage from './pages/Urls';
import UsuariosPage from './pages/Usuarios';


const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={LoginPage} exact path="/geoitbi_admin/" />
        <Route component={DashboardPage} exact path="/geoitbi_admin/dashboard" />
        <Route component={UsuariosPage} exact path="/geoitbi_admin/usuarios" />
        <Route component={GruposPage} exact path="/geoitbi_admin/grupos" />
        <Route component={EmailServerPage} exact path="/geoitbi_admin/servidoremail" />

        <Route component={UrlsPage} exact path="/geoitbi_admin/urls" />
        <Route component={CubPage} exact path="/geoitbi_admin/cub" />
        <Route component={LogsPage} exact path="/geoitbi_admin/logs" />
        <Route component={Integracoes} exact path="/geoitbi_admin/integracoes" />

        <Route component={NotFoundPage} exact={true} path="/geoitbi_admin/*" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
