import { useEffect, useRef, useState, useContext } from 'react'
import "./_navigation.scss";
import IconAngleSvg from "../svgs/IconAngleSvg.jsx";
import SaveDataContext from "../../SaveDataContext.jsx";

/**
 * Component of activity navigation.
 *
 * */
function Navigation({ data }) {
  const hotkey = "hotkey"
  const previous = "předchozí"//t.navigation.previous[lang]
  const hotkeyNext = "hotkeyNext"
  const next = "další"//t.navigation.previous[lang]

  const {
    updateStateOfActivityActiveSlide
  } = useContext(SaveDataContext);

  // Render left and right buttons for navigation. Origin application.
  return (
    <div className={`navigation`}>
      <a className={`nav-button nav-button-prev nav-left`}
         data-save-button="" data-nav-button="prev"
         title= {`${hotkey} : 'shift+space', 'shift+enter', '←'`}
         onClick={ () => {
           setTimeout(()=> {
             updateStateOfActivityActiveSlide(document.querySelector(".active-slide").id)
           },0)
         }}
      >
        <span>
          {previous}
        </span>
        <i className={`icon-svg`}>
          <IconAngleSvg />
        </i>
      </a>
      {data && <div className={`pagination`}>{data.currentSlide}/{data.all}</div>}

      <a className={`nav-button nav-button-next nav-right`}
         data-save-button="" data-nav-button="next"
         title= {`${hotkeyNext} : 'shift+space', 'shift+enter', '←'`}
         onClick={ () => {
           setTimeout(()=> {
             updateStateOfActivityActiveSlide(document.querySelector(".active-slide").id)
           },0)
         }}
      >
        <span>
          {next}
        </span>
        <i className={`icon-svg`}>
          <IconAngleSvg />
        </i>
      </a>

    </div>
  )
}

export default Navigation