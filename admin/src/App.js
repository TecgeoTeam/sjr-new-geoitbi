import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/static/css/global.css';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './Routes';

const browserHistory = createBrowserHistory();

function App() {
  return (
   <>
      <Router history={browserHistory}>
          <Routes />
      </Router>
    {/*<EsriMap />*/}
   </>
  );
}

export default App;
