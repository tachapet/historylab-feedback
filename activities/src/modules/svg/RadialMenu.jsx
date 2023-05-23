import { useEffect } from "react";
import React from 'react';
import SVGRadialMenu from "./svg-lib/svg-radial-menu.js";
import IconSvgTextSvg from "../../layout/svgs/IconSvgTextSvg.jsx";
import IconCloseSvg from "../../layout/svgs/IconCloseSvg.jsx";


/**
 * Component of radial menu in SVG. (Right click menu in SVG). Most of the functions and data from origin application.
 *
 * */
function RadialMenu({ slides }) {
  let point = false;
  let path = false;
  let colors = false;
  let comics = false;

  useEffect(() => {
    const $radialMenu = document.querySelector('[data-radial-menu]');
    if ($radialMenu) {
      const $svgs = document.querySelectorAll('[data-svg-target]');
      const radialMenu = new SVGRadialMenu($radialMenu, $svgs);
    }
  }, []);

  // Render radial menu on each slide. Origin application.
  const renderRadialMenuPerSlide = (slides) => {
    return slides.map((slide, index) => {
      return (
        <React.Fragment key={ `slide-${ index }` }>
          { slide.svg &&
            slide.svg.files[0].features.map((feature, index) => {
                if ((feature === "points" || feature === "draw") && colors !== true) {
                  colors = true;
                  return <React.Fragment key={ `feature-${ index }` }>
                    <div key={ `${ slide.svg.id }-${ feature }-blue` }
                         className={ `radial-menu-item radial-menu-color` }
                         id={ `color-point-blue` }
                         data-radial-menu-item={ "color-point-blue" }
                         data-radial-menu-item-tooltip={ "ZMEN BARVU TODO" }/>
                    <div key={ `${ slide.svg.id }-${ feature }-red` }
                         className={ `radial-menu-item radial-menu-color` }
                         id={ `color-point-red` }
                         data-radial-menu-item={ "color-point-red" }
                         data-radial-menu-item-tooltip={ "ZMEN BARVU TODO" }/>
                  </React.Fragment>
                }
              }
            )
          }
        </React.Fragment>
      )


    })

  }

  return (
    <>
      <div id={ 'radial-menu' } data-radial-menu="">
        <div className={ `radial-menu-wrapper` }>
          <div className={ `radial-menu-tooltip` } data-radial-menu-tooltip="">
          </div>
          { renderRadialMenuPerSlide(slides) }
          <div className={ `radial-menu-item` } id={ `create-text` }
               data-radial-menu-item={ "create-text" }
               data-radial-menu-item-tooltip={ `ADDD TEXT TODO` }>
            <i className={ `icon-svg` }>
              <IconSvgTextSvg />
            </i>
          </div>
          <div className={ `radial-menu-item` } id={ `remove-content` }
               data-radial-menu-item={ "remove-content" }
               data-radial-menu-item-tooltip={ `ODSTRANIT TODO` }>
            <i className={ `icon-svg` }>
              <IconCloseSvg />
            </i>
          </div>
        </div>
      </div>
    </>
  )
}

export default RadialMenu