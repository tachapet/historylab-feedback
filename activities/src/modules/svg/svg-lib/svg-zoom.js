import * as d3 from '../../svg/d3.js';
// https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f
export default class SVGZoom {
  static zoom(svg, view, size) {
    d3.select(svg).call(d3.zoom(size)
      .scaleExtent([1, 4])
      .translateExtent([[-1, -1], [size[0] + 1, size[1] + 1]])
      .on('zoom', (event) => {
        SVGZoom.zoomed(event, view);

        // if scale 0 reset translate position
      }, false)
    );
  }

  static zoomed(event, view) {
    // console.log('zoom');
    view.attr('transform', event.transform);
  }
}