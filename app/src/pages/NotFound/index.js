import React from 'react';

import Navbar from 'react-bootstrap/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar bg="light" variant="light">
          <Navbar.Brand href="/geoitbi/">
            <img 
              src="/geoitbi/logo.png" 
              alt="Logo PMSJR"
              width="32"
              height="42"
              className="d-inline-block align-center"
            />
            {' '}
            Geoportal de ITBI | 404 Ops Página não encontrada..
          </Navbar.Brand>
        </Navbar>
    </>
  );
}
