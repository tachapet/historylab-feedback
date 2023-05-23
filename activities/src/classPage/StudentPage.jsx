import { Button, Col, Container, Row, Table } from "reactstrap";
import { useSearchParams } from "react-router-dom";
import '../App.css'
import { useEffect, useState } from "react";
import "./BasicPages.scss";

/**
 * Component of student page. Render buttons of possible actions.
 * */
export default function StudentPage() {
  const [searchParams] = useSearchParams();
  const studentName = searchParams.get("student");
  const [studentLinks, setStudentLinks] = useState([]);

  useEffect(() => {
    // Fetch available actions from server.
    const fetchClassData = async () => {
      const headers = {}
      headers["Content-Type"] = "application/json";
      let response = await fetch(`/api/get-student-data?studentName=${ studentName }`, {
        method: "GET",
        headers,
      });
      response = await response.json();
      return response;
    }

    fetchClassData().then(response => setStudentLinks(response));
  }, []);


  // Render buttons of available actions for student.
  return (
    <div id="intro-page" style={ { height: "100%" } }
         className={ `basic-page` }>

      <Container className="align-items-center p-5">
        <h1>Test zpětné vazby - žák: { studentName }</h1>
        <Row className={ `m-5` }>
          { studentLinks.map(link => {
            const newTab = link.view ? "_blank" : "";
            const typeOfButton = link.type ? "secondary" : "primary";
            return <Col>
              <Button
                color={ typeOfButton }
                style={ {
                  fontSize: "1.5rem",
                  height: "100%",
                  maxWidth: "15rem"
                } }
                href={ link.url }
                target={ newTab }
              >
                { link.label }
              </Button>
            </Col>
          }) }
        </Row>

      </Container>
    </div>
  );
}