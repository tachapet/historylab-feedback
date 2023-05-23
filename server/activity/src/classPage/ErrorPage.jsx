import { useRouteError } from "react-router-dom";
import "./BasicPages.scss";

/**
 * Component of basic error page.
 * */
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className={`basic-page`}>
      <h1>Oops!</h1>
      <p>Něco špatného se stalo.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}