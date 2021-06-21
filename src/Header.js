import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';

const Header = () => {
    return(
      <Navbar fixed="top" bg="primary" variant="dark">
        <Navbar.Brand>
          <img src="/pdf-icon.png" width="30" height="30" className="d-inline-block align-top" alt="Auto Detect PDF Fields" />
          {' '}Auto Detect PDF Fields
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link href="https://github.com/chengliwang/pdf-field-detection-ui" target="_blank">             
              <OverlayTrigger key="bottom" placement="bottom"
                overlay={
                  <Tooltip>Github</Tooltip>
                }
              >
                 <FaGithub size="24" />
              </OverlayTrigger>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}

export default Header;