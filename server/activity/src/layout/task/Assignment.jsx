
import "./_assignment.scss";

/**
 * Simple component of assigment text. Origin application.
 * */
function Assignment({ data }) {

  return (
    <div id={`row`} className={`zadani-row`}>
      <div className={`zadani`}>
        <h1 className={`zadani-main`}>{ data.main }</h1>
        {data.extended && <h1 className={`zadani-extended`}>{ data.extended }</h1>}
      </div>
    </div>
  )
}

export default Assignment