import * as d3 from '../../svg/d3.js';

export default class SVGDragNDrop {
  // static drag(id) {
  //   d3.drag()
  //     .on('start', () => {
  //       SVGDragNDrop.start(id);
  //     })
  //     .on('drag', () => {
  //       SVGDragNDrop.dragged(id);
  //     })
  //     .on('end', () => {
  //       SVGDragNDrop.end(id);
  //     });
  // }

  static start($element) {
    d3.select($element).raise().classed('is-dragged', true);
  }

  static dragged(event, $element, type, diff, $node) {
    let [xZarov, yZarov] = this.getJustifiedCord(event, $element, type, diff, $node);
    d3.select($element).attr('x', xZarov.toFixed()).attr('y', yZarov.toFixed());
  }

  static end(event, $element, type, diff, $node) {
    let [xZarov, yZarov] = this.getJustifiedCord(event, $element, type, diff, $node);
    d3.select($element)
      .attr('x', xZarov.toFixed())
      .attr('y', yZarov.toFixed())
      // neumožňuje v jiných funkcí s tímto objektem dále pracovat,
      // protože pracují s id
      // .attr('id', `${type}-${d3.event.x.toFixed()}-${d3.event.y.toFixed()}`)
      .classed('is-dragged', false);
  }

  /**
   * Method which return additional offsets due the orientation of textarea
   * @returns {Array} [x,y]
   *
   * @param {Object} orientation object of orentation of textarea against black dot
   * @param {Object} elementResolution object of element resolution
   */
  static getOffsetOfText(orientation, elementResolution) {
    if (orientation[0] === 'left' && orientation[1] === 'top') {
      return [elementResolution.width - 10, elementResolution.height - 10];
    }
    if (orientation[0] === 'left' && orientation[1] === 'bottom') {
      return [elementResolution.width - 10, 0];
    }
    if (orientation[0] === 'right' && orientation[1] === 'top') {
      return [0, elementResolution.height - 10];
    }
    if (orientation[0] === 'right' && orientation[1] === 'bottom') {
      return [0, 0];
    }
  }

  static getJustifiedCord(event, $element, type, diff, $node) {
    const elementResolution = {
      height: $node.offsetHeight,
      width: $node.offsetWidth,
    };

    const svgResolution = $element
      .getAttribute('data-svg-resolution')
      .split(', ')
      .map((e) => parseInt(e, 10));

    switch (type) {
      case 'text':
        return this.textJustified(
          event,
          $element,
          diff,
          elementResolution,
          svgResolution,
        );
      case 'pretahovani':
        return this.pretahovaniJustified(
          event,
          $element,
          diff,
          svgResolution,
        );
      default:
        return this.circleJustified(event, svgResolution, diff, elementResolution);
    }
  }

  static textJustified(event, $element, diff, elementResolution, svgResolution) {
    const orientation = $element
      .getAttribute('data-svg-text-orientation')
      .split(', ');
    const textCenter = this.getOffsetOfText(orientation, elementResolution);
    let xZarov = 0;
    let yZarov = 0;

    // for x
    if (event.x - diff.x <= 10 + textCenter[0]) {
      xZarov = 10 + textCenter[0];
    } else if (
      event.x - diff.x >
      svgResolution[0] - elementResolution.width + textCenter[0]
    ) {
      xZarov = svgResolution[0] - elementResolution.width + textCenter[0];
    } else {
      xZarov = event.x - diff.x;
    }
    // for y
    if (event.y - diff.y <= 10 + textCenter[1]) {
      yZarov = 10 + textCenter[1];
    } else if (
      event.y - diff.y >
      svgResolution[1] - elementResolution.height + textCenter[1]
    ) {
      yZarov = svgResolution[1] - elementResolution.height + textCenter[1];
    } else {
      yZarov = event.y - diff.y;
    }
    return [xZarov, yZarov];
  }

  static pretahovaniJustified(event, $element, diff, svgResolution) {
    const elementResolution = {
      height: $element.attributes.height.value,
      width: $element.attributes.width.value,
    };
    let xZarov = 0;
    let yZarov = 0;
    // FOR X
    // left side
    if (event.x - diff.x <= 0) {
      xZarov = 0;
    }
    // right side
    else if (event.x - diff.x > svgResolution[0] - elementResolution.width) {
      xZarov = svgResolution[0] - elementResolution.width;
    }
    // else for X axis
    else {
      xZarov = event.x - diff.x;
    }
    // FOR Y
    // upper side
    if (event.y - diff.y <= 0) {
      yZarov = 0;
    }
    // down side
    else if (
      event.y - diff.y >
      svgResolution[1] - elementResolution.height
    ) {
      yZarov = svgResolution[1] - elementResolution.height;
    }
    // else for y
    else {
      yZarov = event.y - diff.y;
    }
    return [xZarov, yZarov];
  }

  static circleJustified(event, svgResolution, diff, elementResolution) {
    let xZarov = 0;
    let yZarov = 0;
    // FOR X
    // left side
    if (event.x - diff.x <= elementResolution.width / 2) {
      xZarov = elementResolution.width / 2;
    }
    // right side
    else if (
      event.x - diff.x >
      svgResolution[0] - elementResolution.width / 2
    ) {
      xZarov = svgResolution[0] - elementResolution.width / 2;
    }
    // else for X axis
    else {
      xZarov = event.x - diff.x;
    }
    // FOR Y
    // upper side
    if (event.y - diff.y <= elementResolution.height / 2) {
      yZarov = elementResolution.height / 2;
    }
    // down side
    else if (
      event.y - diff.y >
      svgResolution[1] - elementResolution.height / 2
    ) {
      yZarov = svgResolution[1] - elementResolution.height / 2;
    }
    // else for y
    else {
      yZarov = event.y - diff.y;
    }
    return [xZarov, yZarov];
  }

  static circleMove(d3Element, event, svgResolution, diff, elementResolution) {
    const [xZarov, yZarov] = this.circleJustified(event, svgResolution, diff, elementResolution);
    d3Element.attr('cx', xZarov.toFixed()).attr('cy', yZarov.toFixed());
  }
}