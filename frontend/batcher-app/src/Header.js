import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function Header() {
  return (
    <Navbar bg="white" classsName="white">
      <Container className="fontbody white">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="https://cdn.dribbble.com/users/74401/screenshots/17370041/media/5ea588ed3698da946562b1a9fd9797a6.png?compress=1&resize=400x300&vertical=center"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          {" BATCHER "}
        </Navbar.Brand>

        <Nav className="me-auto white">
          <Nav.Link href="#home" className="white">
            Send
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
