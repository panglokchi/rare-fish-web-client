import {Navbar, Container, Nav, Offcanvas, NavDropdown} from 'react-bootstrap';

import { logout } from '../utils/auth';

function TopNavbar({userData, playerData, sticky = "top"}) {
  return (
    <Navbar sticky={sticky} key={false} expand="xl" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">🐠Rare Fish Investor Simulator</Navbar.Brand>
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
            <Nav className="me-auto" variant="underline" activeKey={window.location.pathname}>
              <Nav.Item>
                <Nav.Link href="/">🏠Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/aquarium">🛁Aquarium</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/fishing">🎣Fishing</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/market">📈Market</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav className="ms-auto mt-auto justify-content-end">
            <Navbar.Text>
              
              </Navbar.Text>
              <Nav.Item>
                <NavDropdown title={`👤${userData.username} - Lvl. ${playerData.level} - 💰${playerData.money.toFixed(2)}`} id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
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
    </Navbar>
  )
}

export default TopNavbar;