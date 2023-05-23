import { useEffect, useRef, useContext } from 'react'
import SVG from "./svg.js";
import SaveDataContext from "../../SaveDataContext.jsx";
import SVGDraw from "./svg-lib/svg-draw.js";
import SVGText from "./svg-lib/svg-text.js";

/**
 * Component of specific SVG item. Commonly - picture.
 * */
function SVGItem({ svg }) {
  const svgRef = useRef(null);
  const dataFetchedRef = useRef(false);

  const {
    modulesData,
    saveDataModuleIntoList,
    stateOfActivity
  } = useContext(SaveDataContext);

  // After module render. Load SVG functions and save module into context.
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const svgJs = new SVG(svgRef.current, stateOfActivity.viewOnly);
    loadData(modulesData[`submission${ stateOfActivity.submission }`]);
    saveDataModuleIntoList(svgRef.current.id, svgRef, saveData);
  }, [svgRef]);

  // Code form origin application
  const svgFunctions = svg.features ? svg.features.join(" ") : "";
  const svgColors = svg.colors ? svg.colors.join(" ") : "";
  const image = {};
  image.src = `/pics/${ svg.file }`;
  image.dimensions = {
    width: 1280,
    height: 1024
  }
  const duplicatedSource = svg.duplicate ? svg.duplicate.join(" ") : false;
  const canDrop = svg.drop ? svg.drop : false;

  /**
   * Method to save the data from specific svg module
   *
   * @param {Object} svgRef - A reference to svg module
   *
   * @returns {Object} Returns the object of svg's values with its attributes.
   *
   * */
  const saveData = (svgRef) => {
    if (!svgRef) return;
    const data = {
      id: '',
      entries: {
        paths: [],
        points: [],
        svgTexts: []
      },

      slide: {
        id: '',
        index: 0,
      }
    }
    data.id = svgRef.id;
    // Get all circles and their attributes
    const allCircles = svgRef.querySelectorAll('[data-svg-circle]');
    allCircles.forEach(circle => {
      const circleData = {
        id: circle.attributes.id.value,
        cx: circle.attributes.cx.value,
        cy: circle.attributes.cy.value,
        color: circle.attributes['data-svg-color'].value,
        submission: stateOfActivity.submission
      }
      data.entries.points.push(circleData);
    });
    // Get all paths and their attributes
    const paths = svgRef.querySelectorAll('[data-svg-path]');
    paths.forEach(path => {
      const pathData = {
        id: path.attributes.id.value,
        d: path.attributes.d.value,
        color: path.attributes['data-svg-color'].value,
        submission: stateOfActivity.submission
      }
      data.entries.paths.push(pathData);
    });
    // Get all textarea and their attributes
    const svgTexts = svgRef.querySelectorAll('[data-svg-text]');
    svgTexts.forEach(svgText => {
      const svgTextData = {
        id: svgText.firstChild.attributes.id.value,
        x: svgText.attributes.x.value,
        y: svgText.attributes.y.value,
        textOrientation: svgText.attributes['data-svg-text-orientation'].value,
        value: svgText.firstChild.value,
        submission: stateOfActivity.submission
      }
      data.entries.svgTexts.push(svgTextData);
    });

    return { [data.id]: data };
  }

  // Remove all data from SVG.
  const resetSVG = () => {
    svgRef.current.querySelectorAll(`[data-svg-type="circle"]`).forEach(e => e.remove());
    svgRef.current.querySelectorAll(`[data-svg-path=""]`).forEach(e => e.remove());
    svgRef.current.querySelectorAll(`[data-svg-text=""]`).forEach(e => e.remove());
  }

  /**
   * Method to load the data to specific SVG
   *
   * @param {Object} data - An object with values and attributes
   *
   * */
  const loadData = (data) => {
    resetSVG();
    const svgId = svgRef.current.id;
    for (const dataKey in data) {
      if (svgId !== dataKey) continue;
      const entries = data[dataKey].entries;
      for (const entriesKey in entries) {
        switch (entriesKey) {
          case "points":
            const points = entries[entriesKey];
            points.forEach(point => {
              SVGDraw.loadCircle(point, svgRef.current, stateOfActivity.viewOnly);
            })
            break;
          case "paths":
            const paths = entries[entriesKey];
            paths.forEach(path => {
              SVGDraw.loadPath(path, svgRef.current, stateOfActivity.viewOnly);
            })
            break;
          case "svgTexts":
            const svgTexts = entries[entriesKey];
            svgTexts.forEach(svgText => {
              SVGText.loadText(svgText, svgRef.current, stateOfActivity.viewOnly);
            })
            break;
        }
      }
    }
  }

  // When submission view is changed, render module with specific mode.
  useEffect(() => {
      loadData(modulesData[`submission${ stateOfActivity.submissionView }`])
    }, [stateOfActivity.submissionView]
  );

  return (
    <>
      <svg className={ `svg unselectable` }
           id={ svg.id }
           data-svg-target={ svgFunctions }
           data-svg-colors={ svgColors }
           data-save={ svg.interactive !== false ? "html" : false }
           data-duplicate-svg={ duplicatedSource }
           data-svg-drop={ canDrop }
           preserveAspectRatio={ `xMidYMin meet` }
           xmlns={ `http://www.w3.org/2000/svg` }
           xmlnsXlink={ `http://www.w3.org/1999/xlink` }
           viewBox={ `0 0 ${ image.dimensions.width } ${ image.dimensions.height }` }
           ref={ svgRef }
      >
        <g className={ `do-not-remove unselectable svg-view` }
           x={ `0.5` }
           y={ `0.5` }
           width={ image.dimensions.width - 1 }
           height={ image.dimensions.height - 1 }
        >
          <image className={ `do-not-remove unselectable` }
                 draggable={ `false` }
                 xlinkHref={ image.src }
                 x={ `0` }
                 y={ `0` }
                 width={ image.dimensions.width }
                 height={ image.dimensions.height }
          >
          </image>
        </g>
      </svg>
    </>
  )
}

export default SVGItem