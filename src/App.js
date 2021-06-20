import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navbar, Nav } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar fixed="top" bg="primary" variant="dark">
        <Navbar.Brand>
          <img src="/pdf-icon.png" width="30" height="30" className="d-inline-block align-top" alt="Auto Detect PDF Fields" />
          {' '}Auto Detect PDF Fields
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link href="https://github.com/chengliwang/pdf-field-detection" target="_blank" title="Github">Github</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    </div>
  );
}

export default App;