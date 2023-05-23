import "./_help.scss";
import MagnifyingGlassSvg from "../svgs/MagnifyingGlassSvg.jsx";
import SvgIconSvg from "../svgs/SvgIconSvg.jsx";
import IconTextSvg from "../svgs/IconTextSvg.jsx";

/**
 * Component with tutorial of slide's module. It contains svg and text. Origin application.
 * */
function Tutorial({ data }) {


  const renderSvgIcon = (activity) => {
    switch(activity){
      case "magnifyingGlass":
        return <MagnifyingGlassSvg />
      case "svg":
        return <SvgIconSvg />
      case "text":
        return <IconTextSvg />
    }
  }


  const renderActivity = (activities) => {
    return activities.map((activity, index) => {
      return (
        <div className={ `help-activity` } key={`tutorial-${index}`}>
          <i className={ `icon-svg` }>
            {renderSvgIcon(activity)}
          </i>
        </div>
      )

    })

  }

  return (
    <div className={ `help-container` }>
      { data.activities &&
        <div className={ `help-activities` }>
          { renderActivity(data.activities) }
          {data.text && <div className={`help-text`}>
            <h6 className={`HELP`}>
              <span>{data.text}NAPOVEDA TEXT</span>
            </h6>
          </div>}
        </div>
      }

    </div>
  )
}

export default Tutorial