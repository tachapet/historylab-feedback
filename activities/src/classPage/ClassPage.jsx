import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "reactstrap";
import { useParams } from "react-router-dom";
import "./BasicPages.scss";
import { toast } from "react-toastify";

/**
 * Component of basic view of class.
 *
 * */
export default function ClassPage() {

  const { classSlug } = useParams();

  const [submissions, setSubmissions] = useState([])
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Get submissions of students.
    const fetchClassData = async () => {
      const headers = {}
      headers["Content-Type"] = "application/json";
      let response = await fetch(`/api/get-class/${ classSlug }/`, {
        method: "GET",
        headers,
      });
      response = await response.json();
      return response;
    }

    fetchClassData().then(response => setSubmissions(response));
  }, []);

  // Reset class data
  const resetClass = async () => {
    const headers = {}
    headers["Content-Type"] = "application/json";
    let response = await fetch(`/api/reset-class/${ classSlug }/`, {
      method: "GET",
      headers,
    });
    window.location.reload(true);
  }

  // Render table of student and available actions.
  return (
    <div id="class-page" className={ `basic-page` }>
      <Container>
        <h1>Test zpětné vazby - třída</h1>
        <Button onClick={ resetClass }>Resetovat třídu "devátá"</Button>
        <Table>
          <thead>
          <tr>
            <th>Student</th>
            <th>Odevzdané cvičení</th>
            <th>Strávený čas</th>
            <th>Nedostatečné</th>
            <th>Oprava</th>
            <th>Strávený čas</th>
            <th>Nedostatečné</th>
          </tr>
          </thead>
          <tbody>
          { submissions.map(submission => {
            return <tr>
              <th scope="row">{ submission.studentName }</th>
              { submission.submission1 && !submission.submission1.feedbackAdded &&
                <td><Button color={ "primary" }
                            href={ `/cviceni/zpetna-vazba-test/zpetna-vazba/${ submission.submission1.entryId }` }>Prohlédnout
                  a dát zpětnou vazbu</Button></td> }
              { submission.submission1 && submission.submission1.feedbackAdded &&
                <td><Button
                  href={ `/cviceni/zpetna-vazba-test/prohlizeni/${ submission.submission1.entryId }` }
                  target="_blank">Prohlédnout
                  si odevzdané cvičení</Button></td> }

              { submission.submission1 &&
                <td>{ submission.submission1.timeSpent }</td> }
              { submission.submission1 &&
                <td><Button onClick={() => toast.info(`Cvičení bylo vráceno`)}>Nelze hodnotit</Button></td> }

              { submission.submission2 && !submission.submission2.feedbackAdded &&
                <td><Button color={ "primary" }
                            href={ `/cviceni/zpetna-vazba-test/zpetna-vazba/${ submission.submission2.entryId }` }>Prohlédnout
                  a dát zpětnou vazbu</Button></td> }
              { submission.submission2 && submission.submission2.feedbackAdded &&
                <td><Button
                  href={ `/cviceni/zpetna-vazba-test/prohlizeni/${ submission.submission2.entryId }` }
                  target="_blank">Prohlédnout
                  si upravené cvičení</Button></td> }

              { submission.submission2 &&
                <td>{ submission.submission2.timeSpent }</td> }
              { submission.submission2 &&
                <td><Button onClick={() => toast.info(`Cvičení bylo vráceno`)}>Nelze hodnotit</Button></td> }
            </tr>
          }) }
          </tbody>
        </Table>
      </Container>
    </div>
  );
}