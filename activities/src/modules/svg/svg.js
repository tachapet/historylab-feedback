/**
 * Code from original application. SVG functtions.
 *
 * */


/**
 * čára:
 *  - nakreslit   ( drag'n'drop )
 *  - smazat      ( left click )
 *  - radial menu ( right click)
 *    - změnit barvu
 *    - smazaní
 *    - textový komentář
 * textové pole:
 *  - vytvořit    ( right click on svg )
 *    - nic => smaže se
 *    - málo znaků => zčervená
 *    - přes řádek textu => zvětší se
 *  - změnit      ( click on and write )
 *  - smazat      ( right click on textarea )
 *  - přenést     ( drag'n'drop )
 *  - radial menu ( right click on mark )
 *    - změnit barvu
 *    - smazaní
 *    - textový komentář
 * značka:
 *  - nakreslit   ( left click on svg )
 *  - přenést     ( drag'n'drop )
 *  - smazat      ( left click on mark )
 *  - radial menu ( right click)
 *    - změnit barvu
 *    - smazaní
 *    - textový komentář
 * komiksová bublina:  ( je již vytvořena předem )
 *  - napsat dovnitř
 *    - nic => zůstane
 *    - přes řádek textu => zvětší se
 */
/* eslint-disable brace-style */
import Component from '../../js/component.js';
import { __dispatchEvent, __removeClass, __addClass, __globalPosition } from '../../js/lib/utils';
import SVGDraw from './svg-lib/svg-draw';
import SVGText from './svg-lib/svg-text';
import SVGDragNDrop from './svg-lib/svg-dragndrop';
import * as d3 from './d3.js';

export default class SVG extends Component {
  constructor($element, viewOnly) {
    super($element);
    this.$canvas = this.target.querySelector('.svg-view');
    this.viewOnly = viewOnly

    this.format = d3.format('.0f');

    this._setSize();

    this.init();
    this._initWhenDone();
  }

  init() {
    if(this.viewOnly) return;
    //if (HISTORYLAB.import.done) return;

    // duplicate source of different svg element
    this.toDuplicate = this.target.getAttribute('data-duplicate-svg');

    // make array from data-attributes (contains what kind of actions can user do on this svg)
    const svgSpecificActions = this.target.getAttribute('data-svg-target').split(' ');

    // get default color
    const colors = this.target.getAttribute('data-svg-colors');

    for (let i = 0; i < svgSpecificActions.length; i += 1) {
      if (svgSpecificActions[i] === 'draw') {
        const svgSpecificColor = colors ? colors.split(' ')[0] : 'yellow';
        this._initPath(this.showFeedback, svgSpecificColor);
      }
      else if (svgSpecificActions[i] === 'points') {
        const svgSpecificColor = colors ? colors.split(' ')[0] : 'blue';
        this._initCircle(this.showFeedback, svgSpecificColor);
      }
      // else if (svgSpecificActions[i] === 'text') {
      //   this._initText();
      // }
    }

    // this._initZoom();
    // comic bubbles if exists
    this._initComicBubbles();

    // listen events
    this._getEvents();
    this._getDropEvent();
  }

  // eslint-disable-next-line class-methods-use-this
  _initWhenDone() {
    //if (!HISTORYLAB.import.done) return;

    d3.selectAll('[data-svg-text] textarea')
      // local context needed because of `this`
      // eslint-disable-next-line func-names
      .on('mouseenter', function () {
        d3.select(this.closest('foreignObject')).raise();
      });
  }

  _setSize() {
    // NOTE: Cannot set `width` because of change of width when on half slide.
    // TODO: set size on window resize

    // might not be needed when inside sortable or other higher level module
    // TODO: add condition for other higher level modules
    // if (this.target.closest('[data-sortable-target')) return false;

    const viewbox = this.target.getAttribute('viewBox').split(' ');
    const rect = this.target.getBoundingClientRect(); // max-height: 100vh
    // const getMaxWidthAbsolute = () => {
    //   if (matchMedia('screen and (min-width: 1025px)').matches) {
    //     return window.innerWidth * .8; // max-width: 62vw
    //   }

    //   return window.innerWidth;
    // };
    const maxWidthAbsolute = window.innerWidth;
    const maxHeightAbsolute = window.innerHeight * 0.9;
    const getHeight = () => {
      if (!rect.height) return viewbox[3];
      if (rect.height > viewbox[3]) return viewbox[3];

      return rect.height;
    };

    const height = getHeight() > maxHeightAbsolute ? maxHeightAbsolute : getHeight();

    const scale = height / viewbox[3];
    const maxWidth = viewbox[2] * scale;
    const setMaxWidth = scale ? `${maxWidth < maxWidthAbsolute ? maxWidth : maxWidthAbsolute}px` : '';

    this.target.style.maxWidth = setMaxWidth;

    // fix for svg + draggable/gallery (horizontal layout) in Chrome
    if (
      this.target.getAttribute('data-svg-drop')
      && !this.target.closest('.layout-vertical')
    ) {
      this.target.closest('.svgs-container').style.maxWidth = setMaxWidth;
    }
  }

  // _initZoom() {
  //   const view = d3.select(`#${this.target.id} .svg-view`);
  //   const size = [
  //     view.attr('width'),
  //     view.attr('height'),
  //   ];
  //   SVGZoom.zoom(this.target, view, size);
  // }

  _initPath(callback, color) {
    d3.select(this.target)
      .call(d3.drag()
        .container(() => this.target)
        .subject((event) => {
          const p = [event.x.toFixed(), event.y.toFixed()];

          return [p, p];
        })
        .on('start', (event) => {
          SVGDraw.renderPath(event, this.target, color, callback);
        }));
  }
  // _initText() {
  //   d3.select(this.target).on('click', () => {
  //     SVGText.openTextDialog(this.target);
  //     d3.event.preventDefault();
  //   });
  // }

  _initCircle(callback, color) {
    d3.select(this.target).on('click', (event) => {
      const item = event.target;
      const { nodeName } = item;
      const validPlace = (nodeName === 'image');
      // const isCircle = (__hasClass(item, 'svg-circle'));

      if (!validPlace) {
        return;
      }

      SVGDraw.createCircle(event, this.target, color);
      callback();

      event.preventDefault();
    }, false);
  }

  _initComicBubbles() {
    const $comicBubbles = this.target.querySelectorAll('.svg-komiks .svg-textarea');

    if ($comicBubbles) {
      $comicBubbles.forEach(($comicBubble) => {
        SVGText.comicBubblesEventsManager(this.target, $comicBubble);
      });
    }
  }

  _generateNewID(oldID) {
    const idParts = oldID.split('_');
    // beware if it's a error, return oldID
    if (idParts.length < 2) {
      console.log('Svg ID error!', oldID);
      return oldID;
    }

    // solve thirt part of id
    if (idParts[idParts.length - 1] !== `clone-${idParts[0]}`) {
      idParts.push(`clone-${idParts[0]}`);
    }

    // solve first part of id
    idParts[0] = this.target.id;

    const newID = idParts.join('_');
    return newID;
  }

  _getEvents() {

    const svgDuplicateSources = this.toDuplicate ? this.toDuplicate.split(' ') : [];

    if (svgDuplicateSources[0]) {

      document.addEventListener('svg.change', (e) => {
        if (svgDuplicateSources.includes(e.detail.svg.id)) {
          const $templateNode = e.detail.svg.node;
          const $templateCircle = e.detail.svg.circle;
          const { nodeName } = e.detail.svg;
          const localNodeID = this._generateNewID($templateNode.id);
          const $localNode = this.target.querySelector(`#${localNodeID}`);
          let task;
          // for creating new element or we edit the old one after created one
          if ($localNode || e.detail.svg.task === 'create') {
            task = e.detail.svg.task;
          } else {
            return;
          }

          /**
           * 1. divided by node name
           * 2. divided by task type
           * path => svg lines
           * TEXTAREA => text fields or comic bubbles
           * foreignObject => svg circles
           */
          if (nodeName === 'path') {
            switch (task) {
              case 'create':
                this._clonePath($templateNode, localNodeID);
                break;
              case 'color':
                __removeClass($localNode, 'red blue');
                __addClass($localNode, e.detail.svg.color);
                break;
              case 'remove':
                $localNode.remove();
                break;
              default:
                console.log('Nondefinated path events task. :(');
            }
          } else if (nodeName === 'TEXTAREA') {
            if (e.detail.svg.isBubble) {
              switch (task) {
                case 'create':
                  this._cloneComicBubbles($templateNode, localNodeID);
                  break;
                case 'change':
                  if ($templateNode.value.length !== 0) {
                    $localNode.value = $templateNode.value;
                    // if needs resize
                    if ($localNode.style.height !== $templateNode.style.height) {
                      $localNode.style.height = $templateNode.style.height;
                    }
                  } else {
                    $localNode.parentElement.remove();
                  }
                  break;
                default:
                  console.log('Nondefinated comicBubble events task. :(');
              }
            } else {
              let templateCircleID;

              // for removing from radial
              if (!$templateCircle) {
                const idParts = $templateNode.id.split('_');
                // the middle part
                // svg-text.js line 44
                idParts[1] += '-circle';
                templateCircleID = idParts.join('_');
              } else {
                templateCircleID = $templateCircle.id;
              }

              const localCircleID = this._generateNewID(templateCircleID);
              const $localCircle = this.target.querySelector(`#${localCircleID}`);

              switch (task) {
                case 'create':
                  this._cloneTextField(e.detail.svg.isWrong, $templateNode, $templateCircle, localNodeID, localCircleID);
                  break;
                case 'change':
                  $localNode.value = $templateNode.value;
                  // if is now wrong lenght
                  if (e.detail.svg.isWrong) {
                    __addClass($localNode, 'is-wrong');
                  } else {
                    __removeClass($localNode, 'is-wrong');
                  }
                  // if needs resize
                  if ($localNode.style.height !== $templateNode.style.height) {
                    $localNode.style.height = $templateNode.style.height;
                  }
                  break;
                case 'color':
                  __removeClass($localCircle, 'red blue');
                  __addClass($localCircle, e.detail.svg.color);
                  break;
                case 'move':
                  if ($localNode) {
                    $localNode.parentElement.remove();
                    $localCircle.remove();
                  }
                  this._cloneTextField(e.detail.svg.isWrong, $templateNode, $templateCircle, localNodeID, localCircleID);
                  break;
                case 'remove':
                  $localNode.parentElement.remove();
                  $localCircle.remove();
                  break;
                default:
                  console.log('Nondefinated textField events task. :(');
              }
            }
          } else if (nodeName === 'circle') {
            switch (task) {
              case 'create':
                this._cloneCircle($templateNode, localNodeID);
                break;
              case 'color':
                __removeClass($localNode, 'red blue');
                __addClass($localNode, e.detail.svg.color);
                break;
              case 'move':
                if ($localNode) {
                  $localNode.remove();
                }
                this._cloneCircle($templateNode, localNodeID);
                break;
              case 'remove':
                $localNode.remove();
                break;
              default:
                console.log('Nondefinated circle events task. :(');
            }
          } else if (nodeName === 'foreignObject') {
            switch (task) {
              case 'create':
                this._cloneDropItem($templateNode, localNodeID);
                break;
              case 'move':
                if ($localNode) {
                  $localNode.remove();
                }
                this._cloneDropItem($templateNode, localNodeID);
                break;
              case 'remove':
                $localNode.remove();
                break;
              default:
                console.log('Nondefinated drop item events task. :(');
            }
          } else {
            console.log('Nondefinated events nodeName. :(', nodeName);
          }

          // dispatch event that svg has changed
          __dispatchEvent(document, 'svg.change', {}, {
            svg: {
              id: this.target.id,
              task: e.detail.svg.task,
              node: $templateNode,
              circle: $templateCircle,
              nodeName,
              contextMenu: false,
            },
          });
        }
      });
    }
  }

  _getDropEvent() {
    // need if we drop more than one same item
    let idSalt = 0;

    document.addEventListener('svg.drop', (event) => {

      if (event.detail.svg.id === this.target.id) {

        const {
          $node, position, type, size,
        } = event.detail.svg;

        const getMultiply = () => {
          // make images smaller when dropped
          if (type === 'image' || type === 'svg') return 0.62;
          // make tags larger when dropped to not jump on more lines
          if (type === 'tag') return 1.075;

          return 1;
        };
        const multiply = getMultiply();

        size.width *= multiply;
        size.height *= multiply;

        const diff = {
          x: this.format((size.width / 2)),
          y: this.format((size.height / 2)),
        };

        const elemSize = {
          h: this.format(size.height),
          w: this.format(size.width),
        };

        const $d3canvas = d3.select(`#${this.target.id} .svg-view`);
        const $d3foreignObject = $d3canvas.append('svg:foreignObject')
          .attr('width', `${elemSize.w}`)
          .attr('height', `${elemSize.h}`)
          .attr('x', this.format(position.x - diff.x))
          .attr('y', this.format(position.y - diff.y))
          .attr('data-svg-resolution', `${$d3canvas.attr('width')}, ${$d3canvas.attr('height')}`)
          .attr('data-svg-type', 'pretahovani')
          .attr('id', `${this.target.id}_${$node.getAttribute('data-id')}_${idSalt}_dropItem`)
          .attr('class', 'unselectable try-something');
          // _dropItem is important identifier

        const $dropItem = $d3foreignObject.append('xhtml:div')
          .attr('class', `dropped__item dropped__item--${type} unselectable`)
          .attr('style', `width: ${elemSize.w}px; height: ${elemSize.h}px;`)
          .node();

        const $itemToAdd = $node.firstElementChild.firstElementChild;
        $itemToAdd.classList.add('unselectable');
        $itemToAdd.style.width = `${elemSize.w}px`;
        $itemToAdd.style.height = `${elemSize.h}px`;
        $itemToAdd.style.paddingLeft = `${this.format(elemSize.w * 0.1)}px`;

        const $textBox = $itemToAdd.querySelector('span');
        $textBox.style.width = `${this.format(elemSize.w * 0.75)}px`;
        $textBox.style.paddingLeft = `${this.format(elemSize.w * 0.05)}px`;

        // const $textIcon = $itemToAdd.querySelector('.keywords-item-icon');
        // $textIcon.style.width = `${this.format(elemSize.w * 0.03)}px`;
        // $textIcon.style.height = `${this.format(elemSize.w * 0.03)}px`;

        $dropItem.appendChild($itemToAdd);

        const $foreignObject = $d3foreignObject.node();

        // increment salt
        idSalt += 1;

        // add events to element
        SVGDraw.dropItemEventsManager(this.target, $foreignObject);
        // fix drop on corners
        SVGDragNDrop.end(position, $foreignObject, 'pretahovani', diff, $node);

        // dispatch event that svg has changed
        __dispatchEvent(document, 'svg.change', {}, {
          svg: {
            id: this.target.id,
            task: 'create',
            node: $foreignObject,
            nodeName: $foreignObject.nodeName,
            contextMenu: false,
          },
        });
      }
    });
  }

  _clonePath($templateNode, localNodeID) {
    const $localNode = $templateNode.cloneNode(true);
    $localNode.id = localNodeID;
    this.$canvas.appendChild($localNode);
    // add events to element
    SVGDraw.pathEventsManager(this.target, $localNode);
  }

  _cloneTextField(isWrong, $templateNode, $templateCircle, localNodeID, localCircleID) {
    // clone comments mark
    const $localCircle = $templateCircle.cloneNode(true);
    $localCircle.id = localCircleID;
    this.$canvas.appendChild($localCircle);

    const $localNode = $templateNode.parentElement.cloneNode(true);
    $localNode.childNodes[0].id = localNodeID;
    this.$canvas.insertBefore($localNode, $localCircle);
    if (isWrong) {
      __addClass($localNode, 'is-wrong');
    } else {
      __removeClass($localNode, 'is-wrong');
    }
    // add events to element
    SVGText.textEventsManager(this.target, $localNode.childNodes[0], $localCircle, false);
  }

  _cloneCircle($templateNode, localNodeID) {
    const $localNode = $templateNode.cloneNode(true);
    $localNode.id = localNodeID;
    this.$canvas.appendChild($localNode);
    SVGDraw.circleEventsManager(this.target, $localNode);

    return $localNode;
  }

  _cloneDropItem($templateNode, localNodeID) {
    const $localNode = $templateNode.cloneNode(true);
    $localNode.id = localNodeID;
    this.$canvas.appendChild($localNode);
    SVGDraw.dropItemEventsManager(this.target, $localNode);

    return $localNode;
  }

  _cloneComicBubbles($templateNode, localNodeID) {
    const $localNode = $templateNode.parentElement.cloneNode(true);
    $localNode.childNodes[1].id = localNodeID;
    this.$canvas.appendChild($localNode);
    // add events to element
    SVGText.comicBubblesEventsManager(this.target, $localNode.childNodes[1]);
  }

  static selectItem(item) {
    item.setAttribute('data-svg-selected', 'true');
  }

  // Remove 'selected' classname from element within SVG
  static deselectItem() {
    // previously "selected" elements
    const selected = document.querySelectorAll('[data-svg-selected="true"]');
    // unselect them
    for (let i = 0; i < selected.length; i += 1) {
      selected[i].setAttribute('data-svg-selected', 'false');
    }
  }

  // Remove element from within SVG
  // [data-svg-selected="true"] marks selected element in SVG
  static removeItem(isRadial, element = '[data-svg-selected="true"]') {
    let $element = document.querySelector(element);
    let nodeName = $element.nodeName;
    const $parent = $element.parentElement; // for <foreignObject>

    // TEXTAREA => text field(right click in textarea)
    // DIV => text field(click in radial menu) or circle
    switch (nodeName) {
      case 'path':
      case 'circle':
        // $element = $element;
        break;
      case 'TEXTAREA':
        // $element = $element;
        break;
      case 'DIV':
        // tag
        if ($parent.getAttribute('data-svg-type') === 'pretahovani') {
          $element = $parent;
        } // comment
        else {
          $element = $parent.childNodes[0];
        }
        nodeName = $element.nodeName;
        break;
      default:
        console.log('Nondefinated node type. :(', nodeName);
    }

    // get svg id from object id
    const svgID = $element.id.split('_')[0];

    // dispatch event that svg has changed
    __dispatchEvent(document, 'svg.change', {}, {
      svg: {
        id: svgID,
        task: 'remove',
        node: $element,
        nodeName,
        contextMenu: isRadial,
      },
    });

    if ($parent.nodeName === 'foreignObject') {
      // remove comment's circle
      // id by svg-text.js line 44
      const elemIdParts = $element.id.split('_');
      d3.select(`[id^="${elemIdParts[0]}_${elemIdParts[1]}-circle"`).remove();

      d3.select($parent).remove();

      // dispatch event that drop item was deleted
      const idParts = $parent.id.split('_');
      const $slide = document.querySelector(`#${svgID}`).closest('.slide');
      if (idParts[idParts.length - 1] === 'dropItem') {
        __dispatchEvent(document, 'svg.drop.delete', {}, {
          item: {
            slideId: $slide.id,
            id: idParts[1],
            $object: $element.firstChild,
          },
        });
      }
    } else {
      d3.select($element).remove();
    }
  }

  // Unmark all SVGs with 'svg-active' classname
  static deactivate() {
    const allActiveSvgs = document.querySelectorAll('[data-svg-active="true"]');
    for (let i = 0; i < allActiveSvgs.length; i += 1) {
      allActiveSvgs[i].setAttribute('data-svg-active', 'false');
    }
  }

  // Mark active SVG with 'svg-active' classname
  static activate(svg) {
    SVG.deactivate();
    svg.setAttribute('data-svg-active', 'true');
  }

  // Remove connection between clone and template
  // Remove third part of id if exists
  static removeCloneConnectionManager($node) {
    const idParts = $node.id.split('_');
    if (idParts[idParts.length - 1].includes('clone')) {
      idParts.pop();
      $node.id = idParts.join('_');
      return true;
    }
    return false;
  }

  // Find near elements if exist
  // Do nothing if event target is element of svg
  // Small black radial menu circle has d=14px (_radial-menu.scss #radial-menu) 6
  // check coordinates for element:
  //  -3,-3  0,-5  +3,-3
  //  -5, 0        +5, 0
  //  -3,+3  0,+5  +3,+3
  static findNearElements(event) {
    let $element = event.target;
    const relativeCoords = [
      [-3, -3], [0, -5], [3, -3], [-5, 0], [5, 0], [-3, 3], [0, 5], [3, 3],
    ];
    // svg-radial-menu filterMenuButtons(clickedItem, hasText, hasMoreColors) 418
    if ($element.nodeName === 'image' || $element.nodeName === 'svg') {
      relativeCoords.every((coord) => {
        const globalPosition = __globalPosition(event);
        const $nextElement = document.elementFromPoint(globalPosition.x + coord[0], globalPosition.y + coord[1]);
        // fix for border where next can be nodes from outside of svg
        if ($nextElement.nodeName === 'DIV' || $nextElement.nodeName === 'svg') {
          return true;
        }

        $element = $nextElement;
        return $element.nodeName === 'image';
      });
    }

    return $element;
  }
}