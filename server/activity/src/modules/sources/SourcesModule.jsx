import "./_sources.scss"

// Used picture from activity Proměny obce Horní Vysoké. Ober-Weissig, 1925. Zdroj: Antikomplex, z.s.
import testPicture from '/pics/pic-00-1280w.jpg';

/**
 * Component of Prameny. Simple view of image.
 *
 * */
function SourcesModule({ sources }) {
  const isMagnifyingGlass = false;

  // Render label. Origin application.
  const renderLabel = (label) => {
    if (label && label.length > 0){
      return (
        <div className={`caption-on-hover`}>
          <div className={`caption-on-hover-text`}> { label }</div>
        </div>
      )
    }
  }

  // Render source. Origin application.
  const renderSource = (sources) => {
    return sources.map((source, index) => {
      return (
        <div className={`item source`} key={index}>
          <div className={`source-container`}>
            <img className={`source-image`}
                 id={ `img-${(index + 1)}` }
                 data-lupa-target={ isMagnifyingGlass ? "" : false }
                 src={testPicture}
            />
          </div>
          {source.labels && renderLabel(source.labels)}
        </div>

      )
    });
  };

  return (
    <>
      <div
        className={ `row sources ${sources > 4 ? "sources--grid": ""}` }
      >
        {renderSource(sources)}
      </div>
    </>
  )
}

export default SourcesModule