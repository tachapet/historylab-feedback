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
    <div id="intro-page" style={ { height: "100%" } } className={`basic-page`}>
      <Container className="h-100 d-flex align-items-center justify-content-center"
                 >
        <Row>
          <Col>
            <Button  style={ { fontSize: "3rem", height: "100%" } } onClick={ () => navigate("/trida/devata") }>Odkaz na
              třídu</Button>
          </Col>
          <Col className={"xl"} style={ { fontSize: "5rem" } }>
            <Button  style={ { fontSize: "3rem", height: "100%" } } onClick={ () => navigate("/zak?student=Petr Novák") }>Odkaz na
              žáka Petr Novák</Button>
          </Col>
        </Row>

      </Container>
    </div>
  );
}