import {
  __addClass,
  __removeClass,
  __hasClass,
  __dispatchEvent,
} from '../../../js/lib/utils';

import SVG from '../svg';
import SVGDragNDrop from './svg-dragndrop';
import * as d3 from '../../svg/d3.js';

export default class SVGText {
  static createText(maxLength = 333, minLength = 2) {
    const defaultWidth = '15.2rem';
    const defaultHeight = '55px';

    const $svg = document.querySelector('[data-svg-active="true"]');
    const svgID = $svg.id;
    const svgGroup = d3.select($svg).select('.svg-view');

    // const $canvas = $svg.querySelector('.svg-view');
    const $radialMenu = document.querySelector('[data-radial-menu]');
    const localPosition = {
      x: $radialMenu.getAttribute('data-local-x'),
      y: $radialMenu.getAttribute('data-local-y'),
    };
    const id = `${svgID}_svg-text-${localPosition.x}-${localPosition.y}`;
    const hash = `#${id}`;
    const orientation = {
      x: (svgGroup.attr('width') - localPosition.x) > 320 ? 'right' : 'left',
      y: (svgGroup.attr('height') - localPosition.y) > 60 ? 'bottom' : 'top',
    };
    // let firstWrite = true;

    // text wrapper
    const foreignObject = svgGroup.append('svg:foreignObject')
      .attr('class', `svg-text orientation-${orientation.x} orientation-${orientation.y} unselectable`)
      .attr('data-svg-text', '')
      .attr('x', localPosition.x)
      .attr('y', localPosition.y)
      .attr('data-svg-text-orientation', `${orientation.x}, ${orientation.y}`)
      .attr('data-svg-resolution', `${svgGroup.attr('width')}, ${svgGroup.attr('height')}`)
      .attr('style', `width: ${defaultWidth}; height: ${defaultHeight};`);

    // create visual point of interest for text input
    const circle = svgGroup.append('svg:circle')
      .attr('id', `${id}-circle`)
      .attr('cx', localPosition.x)
      .attr('cy', localPosition.y)
      .attr('class', 'svg-circle svg-circle-text do-not-remove unselectable');

    // create text input
    const textarea = foreignObject.append('xhtml:textarea')
      .attr('maxlength', maxLength)
      .attr('tabindex', '-1')
      .attr('id', id)
      .attr('class', 'svg-textarea')
      .attr('data-save', '')
      .attr('data-svg-textarea-target', svgID)
      .attr('style', `width: ${defaultWidth}; height: ${defaultHeight};`);

    // fix visual orientation on bottom
    SVGText.fixVisualOrientation(foreignObject.node());

    // set focus to the new text input
    $svg.querySelector(hash).focus();

    // add events to element
    SVGText.textEventsManager($svg, textarea.node(), circle.node(), true, minLength);
  }

  /**
   * Load text
   *
   * */
  static loadText(svgText, $svg, viewOnly) {
    const maxLength = 333
    const minLength = 2
    const defaultWidth = '15.2rem';
    const defaultHeight = '55px';

    //const $svg = document.querySelector('[data-svg-active="true"]');
    const svgID = $svg.id;
    const svgGroup = d3.select($svg).select('.svg-view');

    // const $canvas = $svg.querySelector('.svg-view');
    //const $radialMenu = document.querySelector('[data-radial-menu]');
    const localPosition = {
      x: svgText.x,
      y: svgText.y,
    };
    const id = `${svgText.id}`;
    const hash = `#${id}`;
    const orientation = {
      x: (svgGroup.attr('width') - localPosition.x) > 320 ? 'right' : 'left',
      y: (svgGroup.attr('height') - localPosition.y) > 60 ? 'bottom' : 'top',
    };
    // let firstWrite = true;

    // text wrapper
    const foreignObject = svgGroup.append('svg:foreignObject')
      .attr('class', `svg-text orientation-${orientation.x} orientation-${orientation.y} unselectable`)
      .attr('data-svg-text', '')
      .attr('x', localPosition.x)
      .attr('y', localPosition.y)
      .attr('data-svg-text-orientation', `${orientation.x}, ${orientation.y}`)
      .attr('data-svg-resolution', `${svgGroup.attr('width')}, ${svgGroup.attr('height')}`)
      .attr('style', `width: ${defaultWidth}; height: ${defaultHeight};`);

    // create visual point of interest for text input
    const circle = svgGroup.append('svg:circle')
      .attr('id', `${id}-circle`)
      .attr('cx', localPosition.x)
      .attr('cy', localPosition.y)
      .attr('class', 'svg-circle svg-circle-text do-not-remove unselectable');

    // create text input
    const textarea = foreignObject.append('xhtml:textarea')
      .attr('maxlength', maxLength)
      .attr('tabindex', '-1')
      .attr('id', id)
      .attr('class', 'svg-textarea')
      .attr('data-save', '')
      .attr('data-svg-textarea-target', svgID)
      .attr('style', `width: ${defaultWidth}; height: ${defaultHeight};`)
      .attr('value', svgText.value);

    textarea.node().value = svgText.value;

    // fix visual orientation on bottom
     SVGText.fixVisualOrientation(foreignObject.node());

    if(viewOnly) {
      textarea.node().readOnly = true;
      return;
    }
    // add events to element
    SVGText.textEventsManager($svg, textarea.node(), circle.node(), true, minLength);
  }

  static textEventsManager($svg, $textarea, $circle, isCreated, minLength = 2) {
    const $canvas = $svg.querySelector('.svg-view');
    const hash = `#${$textarea.id}`;
    let firstWrite = isCreated;
    let oldText = $textarea.value;

    // TODO
    // standalone function
    // same for all draggable svg elements
    const $element = $svg.querySelector(hash).parentElement;
    let elementPosition = [
      $element.getAttribute('x'),
      $element.getAttribute('y'),
    ];
    let diff = {};

    d3.select(hash)
      // drag & drop
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
            event: { from: 'text.drag.start', data: event },
          });
        })
        .on('drag', (event) => {
          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.stopPropagation', {}, { event: {} });

          SVGDragNDrop.dragged(event, $element, 'text', diff, $textarea);

          // circle is moving with text
          $circle.setAttribute('cx', $element.getAttribute('x'));
          $circle.setAttribute('cy', $element.getAttribute('y'));
        })
        .on('end', (event) => {
          // dispatch event for radio menu - iOS fix
          __dispatchEvent(document, 'event.stopPropagation', {}, { event: {} });
          // enable editting created comment
          $textarea.focus();

          const oldXCoordinate = elementPosition[0];
          const oldYCoordinate = elementPosition[1];
          let taskType = 'move';

          SVGDragNDrop.end(event, $element, 'text', diff, $textarea);

          elementPosition = [
            $element.getAttribute('x'),
            $element.getAttribute('y'),
          ];

          // circle is moving with text
          $circle.setAttribute('cx', elementPosition[0]);
          $circle.setAttribute('cy', elementPosition[1]);

          if (!firstWrite && (elementPosition[0] !== oldXCoordinate || elementPosition[1] !== oldYCoordinate)) {
            // if clone is changed, then dispatch create event
            if (SVG.removeCloneConnectionManager($element.childNodes[0])) {
              taskType = 'create';
              // also for circle
              SVG.removeCloneConnectionManager($circle);
            }

            // dispatch event that svg has changed
            __dispatchEvent(document, 'svg.change', {}, {
              svg: {
                id: $svg.id,
                task: taskType,
                node: $element.childNodes[0],
                nodeName: $element.childNodes[0].nodeName,
                circle: $circle,
                contextMenu: false,
              },
            });
          }

          // fix for tablets and mobiles
          // circle must be over text
          d3.select($circle).raise();
        }))
      // keystroke
      // control height of the text input on every key stroke
      .on('keyup', (event) => {
        SVGText.updateTextareaHeight(event.target);
      })
      // loss of focus
      .on('blur', (event) => {
        const $target = event.target;
        const { value } = $target;
        let taskType;
        let wrongBool = false;

        if (value.length === 0) {
          SVG.removeItem(false, hash);
          return;
        }
        if (value.length < minLength) {
          __addClass($target, 'is-wrong');
          wrongBool = true;
        }
        else if ((value.length >= minLength) && __hasClass($target, 'is-wrong')) {
          __removeClass($target, 'is-wrong');
          wrongBool = false;
        }

        if (oldText !== value) {
          if (firstWrite) {
            taskType = 'create';
            firstWrite = false;
          }
          else {
            taskType = 'change';
          }
          oldText = value;
          // if clone is changed, then dispatch create event
          if (SVG.removeCloneConnectionManager($target)) {
            taskType = 'create';
            // also for circle
            SVG.removeCloneConnectionManager($circle);
          }

          // dispatch event that svg has changed
          __dispatchEvent(document, 'svg.change', {}, {
            svg: {
              id: $svg.id,
              task: taskType,
              node: $target,
              nodeName: $target.nodeName,
              circle: $circle,
              isWrong: wrongBool,
              contextMenu: false,
            },
          });
        }

        // update oldText
        oldText = value;
        // fix ios text writing
        event.target.classList.remove('unselectable');
      })
      // gain focus
      .on('focus', () => {
        d3.select($element).raise();
        d3.select($circle).raise();
      });
  }

  static updateTextareaHeight($target) {
    $target.style.height = '1px';

    const newHeight = `${22 + $target.scrollHeight}px`;
    $target.style.height = newHeight;

    // fix value for FO either
    const $parent = $target.parentElement;
    $parent.style.height = newHeight;
    // fix visual orientation on bottom
    SVGText.fixVisualOrientation($parent);
  }

  static fixVisualOrientation($element) {
    const currentCommentWidth = $element.style.width;
    const currentCommentHeight = $element.style.height;
    if ($element.classList.contains('orientation-left') && $element.classList.contains('orientation-top')) {
      $element.style.transform = `translate(-${currentCommentWidth}, -${currentCommentHeight})`;
    }
    else if ($element.classList.contains('orientation-top')) {
      $element.style.transform = `translateY(-${currentCommentHeight})`;
    }
    else if ($element.classList.contains('orientation-left')) {
      $element.style.transform = `translateX(-${currentCommentWidth})`;
    }
  }

  static comicBubblesEventsManager($svg, $node) {
    let firstWrite = true;
    let oldText = $node.value;

    d3.select($node).on('keyup', (event) => {
      SVGText.updateTextareaHeight(event.target);
    })
      .on('blur', (event) => {
        const $target = event.target;
        const { value } = $target;
        let taskType;

        if (oldText !== value) {
          if (firstWrite) {
            taskType = 'create';
            firstWrite = false;
          }
          else {
            taskType = 'change';
            if (value.length === 0) {
              firstWrite = true;
            }
          }
          oldText = value;
          // if clone is changed, then dispatch create event
          if (SVG.removeCloneConnectionManager($target)) taskType = 'create';

          // dispatch event that svg has changed
          __dispatchEvent(document, 'svg.change', {}, {
            svg: {
              id: $svg.id,
              task: taskType,
              node: $target,
              nodeName: $target.nodeName,
              isBubble: true,
              contextMenu: false,
            },
          });
        }

        // update oldText
        oldText = value;
      });
  }
}