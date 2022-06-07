import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UsuariosPage from './pages/Usuarios';
import GruposPage from './pages/Grupos';
import EmailServerPage from './pages/EmailServer';
import UrlsPage from './pages/Urls';
import CubPage from './pages/Cub';
import LogsPage from './pages/LogsSistema';
import Integracoes from './pages/Integracoes';
import NotFoundPage from './pages/NotFound';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={LoginPage} exact path="/" />
        <Route component={DashboardPage} exact path="/dashboard" />
        <Route component={UsuariosPage} exact path="/usuarios" />
        <Route component={GruposPage} exact path="/grupos" />
        <Route component={EmailServerPage} exact path="/servidoremail" />

        <Route component={UrlsPage} exact path="/urls" />
        <Route component={CubPage} exact path="/cub" />
        <Route component={LogsPage} exact path="/logs" />
        <Route component={Integracoes} exact path="/integracoes" />

        <Route component={NotFoundPage} exact={true} path="*" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
