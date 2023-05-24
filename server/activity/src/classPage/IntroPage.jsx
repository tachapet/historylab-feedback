import { Button, Col, Container, Row, Table } from "reactstrap";
import { useNavigate } from "react-router-dom";
import '../App.css'
import "./BasicPages.scss";

/**
 * Component of intro page. User select class or student.
 * */
export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div id="intro-page" style={ { height: "100%" } }
         className={ `basic-page` }>
      <Container
        className="h-100 d-flex  align-items-center justify-content-center"
      >
        <Row>
          <Col>
            <Button style={ { fontSize: "3rem", height: "100%" } }
                    color={ `primary` }
                    onClick={ () => navigate("/trida/devata") }>Odkaz na
              třídu</Button>
          </Col>
          <Col>
            <Row className={ "mb-1" }><Button
              style={ { fontSize: "2rem", height: "100%" } }
              onClick={ () => navigate("/zak?student=Petr Novák") }>Odkaz na
              žáka<br/><span style={ { fontWeight: "bold", color: "orange" } }>Petr Novák</span></Button></Row>
            <Row><Button style={ { fontSize: "2rem", height: "100%" } }
                         onClick={ () => navigate("/zak?student=Pavel Svoboda") }>Odkaz
              na
              žáka<br/><span style={ { fontWeight: "bold", color: "#FD9C0D" } }>Pavel Svoboda</span></Button></Row>
          </Col>
        </Row>

      </Container>
    </div>
  );
}