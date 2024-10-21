import { useState } from 'react';
import {Navbar, Container, Nav, Offcanvas, NavDropdown, Modal} from 'react-bootstrap';

import { logout } from '../utils/auth';
import RegisterGuest from './RegisterGuest';

function TopNavbar({userData, playerData, sticky = "top", tab="home", setTab=null, updatePlayerData=null}) {
  const [showRegisterGuest, setShowRegisterGuest] = useState(false);
  return (
    <Navbar sticky={sticky} key={false} expand={true} className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className="d-none d-lg-block" href="/">🐠Rare Fish Investor Simulator</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${false}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
          data-bs-theme="dark"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
              🐠 Rare Fish Investor Simulator
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto" variant="underline" activeKey={tab}>
              <Nav.Item className="d-sm-none d-block" onClick={()=>{
                  setTab("home");
                  window.history.replaceState(null, "Home", "/")
                }}>
                <Nav.Link eventKey="home">🏠</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-none d-sm-block" onClick={()=>{
                setTab("home");
                window.history.replaceState(null, "Home", "/")
                }}>
                <Nav.Link eventKey="home">🏠Home</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-sm-none d-block" onClick={()=>{
                setTab("aquarium");
                window.history.replaceState(null, "Aquarium", "/aquarium")
                }}>
                <Nav.Link eventKey="aquarium">🛁</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-none d-sm-block" eventKey={"aquarium"} onClick={()=>{
                setTab("aquarium")
                window.history.replaceState(null, "Aquarium", "/aquarium")
                }}>
                <Nav.Link eventKey="aquarium">🛁Aquarium</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-sm-none d-block" onClick={()=>{
                setTab("fishing")
                window.history.replaceState(null, "Fishing", "/fishing")
                }}>
                <Nav.Link eventKey="fishing">🎣</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-none d-sm-block" onClick={()=>{
                setTab("fishing")
                window.history.replaceState(null, "Fishing", "/fishing")
              }}>
                <Nav.Link eventKey="fishing">🎣Fishing</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-sm-none d-block" onClick={()=>{
                setTab("market")
                window.history.replaceState(null, "📈Market", "/market")
                }}>
                <Nav.Link eventKey="market">📈</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-none d-sm-block" onClick={()=>{
                setTab("market")
                window.history.replaceState(null, "📈Market", "/market")
                }}>
                <Nav.Link eventKey="market">📈Market</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav className="ms-auto mt-auto justify-content-end">
            <Navbar.Text>
              
              </Navbar.Text>
              <Nav.Item className="d-md-none d-block" >
                <NavDropdown title={`👤`} id="basic-nav-dropdown" align="end">
                  { userData.__t == "Guest" &&
                    <NavDropdown.Item onClick={()=>{setShowRegisterGuest(true)}}>Register Account</NavDropdown.Item>
                  }
                  <NavDropdown.Item onClick={()=>{
                    logout();
                  }} href="/">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav.Item>
              <Nav.Item className="d-none d-md-block">
                <NavDropdown title={`👤${userData.username} - Lvl. ${playerData.level} - 💰${playerData.money.toFixed(2)}`} id="basic-nav-dropdown" align="end">
                  { userData.__t == "Guest" &&
                    <NavDropdown.Item onClick={()=>{setShowRegisterGuest(true)}}>Register Account</NavDropdown.Item>
                  }
                  <NavDropdown.Item onClick={()=>{
                    logout();
                  }} href="/">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav.Item>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      <RegisterGuest show={showRegisterGuest} onHide={()=>{setShowRegisterGuest(false)}}
        updatePlayerData={()=>{updatePlayerData()}}></RegisterGuest>
    </Navbar>
  )
}

export default TopNavbar;