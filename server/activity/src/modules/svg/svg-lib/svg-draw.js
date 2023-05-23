import { __localPosition, __dispatchEvent, __getElementComputedValue } from '../../../js/lib/utils';

// import SVG from '../svg';
import * as d3 from '../d3.js';
import SVGDragNDrop from './svg-dragndrop';
import SVG from '../svg';

export default class SVGDraw {
  // static selectPath(svg) {
  //   // https://bl.ocks.org/mbostock/8027637
  // }

  static renderPath(event, $svg, color, callback) {
    if (event.sourceEvent.target.nodeName === 'image') {

      const line = d3.line()
        // removed smooth curve to get rid of loong decimals
        // see https://github.com/d3/d3-path/issues/10
        .curve(d3.curveLinear); // _dragStarted

      const format = d3.format('.0f');
      const d = event.subject;
      // origin
      let x0 = format(event.x);
      let y0 = format(event.y);

      const id = `${$svg.id}_path-${x0}-${y0}`;
      const active = d3.select(`#${$svg.id} .svg-view`).append('svg:path')
        // .attr('marker-start', 'url('#marker-circle-blue')')
        // .attr('marker-end', 'url('#marker-arrow-blue')')
        .attr('data-svg-path', '')
        .attr('class', `svg-path ${color}`)
        .attr('data-svg-color', color)
        .attr('id', id)
        .datum(d);

      // github.com/d3/d3-drag#event_on
      event
        .on('drag', (dragEvent) => {
          // current position
          const x1 = format(dragEvent.x);
          const y1 = format(dragEvent.y);
          // distance from origin
          const dx = x1 - x0;
          const dy = y1 - y0;

          // if the distance of drag event is too large, make new origin
          if ((dx * dx) + (dy * dy) > 300) d.push([x0 = x1, y0 = y1]);
          // smooth line, correct last point
          else d[d.length - 1] = [x1, y1];

          active.attr('d', line);
        })
        .on('end', () => {
          const $thisPath = d3.select(`#${id}`);
          if ($thisPath) {
            if ($thisPath.attr('d')) {
              if ($thisPath.attr('d').length < 40) {
                $thisPath.remove();
              }
              else {
                // dispatch event that svg has changed
                __dispatchEvent(document, 'svg.change', {}, {
                  svg: {
                    id: $svg.id,
                    task: 'create',
                    node: $thisPath.node(),
                    nodeName: $thisPath.node().nodeName,
                    contextMenu: false,
                  },
                });
              }
            }
            else if (!$thisPath.attr('d')) {
              $thisPath.remove();
            }
          }

          callback();
        });

      // add events to element
      SVGDraw.pathEventsManager($svg, d3.select(`#${id}`).node());
    }
  }

  // Draw a SVG circle on click
  static createCircle(event, $svg, color) {
    const svgGroup = d3.select($svg).select('.svg-view');
    // d3.select(`#${$svg.id} .svg-view`);
    // const canvas = document.querySelector(`#${$svg.id} .svg-view`);
    const localPosition = __localPosition(event, $svg);
    const id = `${$svg.id}_circle-${localPosition.x}-${localPosition.y}`;

    const $circle = svgGroup.append('svg:circle')
      .attr('data-svg-circle', '')
      .attr('id', id)
      .attr('cx', localPosition.x)
      .attr('cy', localPosition.y)
      .attr('data-svg-resolution', `${svgGroup.attr('width')}, ${svgGroup.attr('height')}`)
      .attr('data-svg-type', 'circle')
      .attr('data-svg-color', color)
      .attr('class', `svg-circle ${color} unselectable`);

    const $element = document.querySelector(`#${id}`);

    // add events to element
    SVGDraw.circleEventsManager($svg, $element);

    // dispatch event that svg has changed
    __dispatchEvent(document, 'svg.change', {}, {
      svg: {
        id: $svg.id,
        task: 'create',
        node: $element,
        nodeName: $element.nodeName,
        contextMenu: false,
      },
    });
  }

  /**
   * Load circle from data.
   *
   * */
  // Draw a SVG circle on click
  static loadCircle(circle, $svg, viewOnly) {
    const svgGroup = d3.select($svg).select('.svg-view');
    // d3.select(`#${$svg.id} .svg-view`);
    // const canvas = document.querySelector(`#${$svg.id} .svg-view`);
    const id = `${circle.id}`;

    const $circle = svgGroup.append('svg:circle')
      .attr('data-svg-circle', '')
      .attr('id', id)
      .attr('cx', circle.cx)
      .attr('cy', circle.cy)
      .attr('data-svg-resolution', `${svgGroup.attr('width')}, ${svgGroup.attr('height')}`)
      .attr('data-svg-type', 'circle')
      .attr('data-svg-color', circle.color)
      .attr('class', `svg-circle ${circle.color} unselectable`);

    const $element = document.querySelector(`#${id}`);

    if(viewOnly) return;
    // add events to element
    SVGDraw.circleEventsManager($svg, $element);
  }

  /**
   * Load path from data.
   *
   * */
  static loadPath(path, $svg, viewOnly) {
    const svgGroup = d3.select($svg).select('.svg-view');

    const id = `${path.id}`;
    svgGroup.append('svg:path')
        .attr('data-svg-path', '')
        .attr('class', `svg-path ${path.color}`)
        .attr('id', id)
        .attr('data-svg-color', path.color)
        .attr("d", path.d);

      if(viewOnly) return;
      // add events to element
      SVGDraw.pathEventsManager($svg, d3.select(`#${id}`).node());

  }


  static pathEventsManager($svg, $element) {
    d3.select(`#${$element.id}`).on('click', (event) => {
      // dispatch event that svg has changed
      __dispatchEvent(document, 'svg.change', {}, {
        svg: {
          id: $svg.id,
          task: 'remove',
          node: event.target,
          nodeName: event.target.nodeName,
          contextMenu: false,
        },
      });

      d3.select(`#${$element.id}`).remove();

      event.preventDefault();
    }, false);
  }

  static circleEventsManager($svg, $element) {
    const $canvas = document.querySelector(`#${$svg.id} .svg-view`); // group <g>...</g>
    const d3Element = d3.select($element);
    const svgResolution = [
      parseInt($canvas.getAttribute('width'), 10),
      parseInt($canvas.getAttribute('height'), 10),
    ];
    const circleR = __getElementComputedValue($element, 'r');
    const elementResolution = [
      circleR * 2, // height
      circleR * 2, // width
    ];

    // TODO:
    // standalone function
    // same for all draggable svg elements
    let elementPosition = [
      d3Element.attr('cx'),
      d3Element.attr('cy'),
    ];
    let diff = {};

    d3Element.on('click', (event) => {

      // dispatch event that svg has changed
      __dispatchEvent(document, 'svg.change', {}, {
        svg: {
          id: $svg.id,
          task: 'remove',
          node: $element,
          nodeName: $element.nodeName,
          contextMenu: false,
        },
      });

      event.target.remove();
    })
      .call(d3.drag()
        .container($canvas)
        .subject($element)
        .on('start', (event) => {
          diff = {
            x: event.x - elementPosition[0],
            y: event.y - elementPosition[1],
          };

          SVGDragNDrop.start($element);

          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.propagation', {}, {
            event: { from: 'circle.drag.start', data: event },
          });
        })
        .on('drag', (event) => {
          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.stopPropagation', {}, { event: {} });
          if (d3Element.attr('data-svg-selected') === 'true') return;

          SVGDragNDrop.circleMove(d3Element, event, svgResolution, diff, elementResolution);
        })
        .on('end', (event) => {
          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.stopPropagation', {}, { event: {} });
          if (d3Element.attr('data-svg-selected') === 'true') return;

          const oldXCoordinate = elementPosition[0];
          const oldYCoordinate = elementPosition[1];
          let taskType = 'move';

          SVGDragNDrop.circleMove(d3Element, event, svgResolution, diff, elementResolution);
          d3Element.classed('is-dragged', false);

          elementPosition = [
            $element.getAttribute('cx'),
            $element.getAttribute('cy'),
          ];

          // if clone is changed, then dispatch create event
          if (SVG.removeCloneConnectionManager($element)) taskType = 'create';

          if (elementPosition[0] !== oldXCoordinate || elementPosition[1] !== oldYCoordinate) {
            // dispatch event that svg has changed
            __dispatchEvent(document, 'svg.change', {}, {
              svg: {
                id: $svg.id,
                task: taskType,
                node: $element,
                nodeName: $element.nodeName,
                contextMenu: false,
              },
            });
          }
        }));
  }

  // it is mimular to circle EventManager but not same
  static dropItemEventsManager($svg, $element) {
    const $canvas = document.querySelector(`#${$svg.id} .svg-view`); // group <g>...</g>
    const d3Element = d3.select($element);

    // TODO:
    // standalone function
    // same for all draggable svg elements
    let elementPosition = [
      d3Element.attr('x'),
      d3Element.attr('y'),
    ];
    let diff = {};

    d3Element.on('click', () => {

      // dispatch event that svg has changed
      __dispatchEvent(document, 'svg.change', {}, {
        svg: {
          id: $svg.id,
          task: 'remove',
          node: $element,
          nodeName: $element.nodeName,
          contextMenu: false,
        },
      });

      // dispatch event that drop item was deleted
      const idParts = $element.id.split('_');
      const $slide = $svg.closest('.slide');
      if (idParts[idParts.length - 1] === 'dropItem') {
        __dispatchEvent(document, 'svg.drop.delete', {}, {
          item: {
            slideId: $slide.id,
            id: idParts[1],
            $object: $element.firstChild,
          },
        });
      }

      $element.remove();
    })
      .call(d3.drag()
        .container($canvas)
        .subject($element)
        .on('start', (event) => {
          diff = {
            x: event.x - elementPosition[0],
            y: event.y - elementPosition[1],
          };

          SVGDragNDrop.start($element);

          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.propagation', {}, {
            event: { from: 'circle.drag.start', data: event },
          });
        })
        .on('drag', (event) => {
          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.stopPropagation', {}, { event: {} });
          if (d3Element.attr('data-svg-selected') === 'true') return;

          SVGDragNDrop.dragged(event, $element, 'pretahovani', diff, $element);
        })
        .on('end', (event) => {
          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.stopPropagation', {}, { event: {} });
          if (d3Element.attr('data-svg-selected') === 'true') return;

          const oldXCoordinate = elementPosition[0];
          const oldYCoordinate = elementPosition[1];
          let taskType = 'move';

          SVGDragNDrop.end(event, $element, 'pretahovani', diff, $element);

          d3Element.classed('is-dragged', false);

          elementPosition = [
            $element.getAttribute('x'),
            $element.getAttribute('y'),
          ];

          // if clone is changed, then dispatch create event
          if (SVG.removeCloneConnectionManager($element)) taskType = 'create';

          if (elementPosition[0] !== oldXCoordinate || elementPosition[1] !== oldYCoordinate) {
            // dispatch event that svg has changed
            __dispatchEvent(document, 'svg.change', {}, {
              svg: {
                id: $svg.id,
                task: taskType,
                node: $element,
                nodeName: $element.nodeName,
                contextMenu: false,
              },
            });
          }
        }));
  }
}