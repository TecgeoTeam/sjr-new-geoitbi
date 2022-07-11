import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import NotFoundPage from './pages/NotFound';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={LoginPage} exact path="/geoitbi/" />
        <Route component={DashboardPage} exact path="/geoitbi/app" />
        <Route component={NotFoundPage} exact={true} path="*" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
