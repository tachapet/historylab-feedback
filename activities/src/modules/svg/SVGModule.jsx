import './_svg.scss'
import SVGItem from "./SVGItem.jsx";

/**
 * Component of SVG module. It can contain one or more SVG items (pictures).
 * */
function SVGModule({ svgs }) {

  // Render label of SVG item. Origin application.
  const renderLabel = (label) => {
    if (label && label.length > 0){
      return (
        <div className={`caption-on-hover`}>
          <div className={`caption-on-hover-text`}> { label }</div>
        </div>
      )
    }
  }

  // Render each svg items specified in array in metadata of activity.
  const renderSvgs = (files) => {
    return files.map(svg => {
      return (
        <div className={`item source`} data-sortable-inheritor-item={false} key={svg.id}>
          <SVGItem svg={ svg } />
          {svg.labels && renderLabel(svg.labels)}
        </div>

      )
    });
  };

  return (
    <>
      <div
        className={ `svgs layout-vertical` }
        key={svgs.id}
      >
        <div className={ `svgs__inner` }>
          <div className={`svgs-container`}>
            {renderSvgs(svgs.files)}
          </div>
        </div>
      </div>
    </>
  )
}

export default SVGModule