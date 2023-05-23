/* eslint-disable brace-style */
import {
  __addClass,
  __removeClass,
  __hasClass,
  __localPosition,
  __globalPosition,
  __dispatchEvent,
} from '../../../js/lib/utils';
import SVG from '../svg';
import SVGText from './svg-text';
import * as d3 from '../../svg/d3.js';

export default class SVGRadialMenu {

  constructor($radialMenu, $svgs) {
    this.$radialMenu = $radialMenu;
    this.$radialMenuItems = this.$radialMenu.querySelectorAll('[data-radial-menu-item]');
    this.$colorItems = this.$radialMenu.querySelectorAll('.radial-menu-color');
    this.$textItems = this.$radialMenu.querySelectorAll('.radial-menu-text');
    this.$createTextItem = this.$radialMenu.querySelector('#create-text');
    this.$removeItem = this.$radialMenu.querySelector('#remove-content');
    this.$tooltip = this.$radialMenu.querySelector('[data-radial-menu-tooltip]');
    this.$svgs = $svgs;

    this.initialSetUp = true;

    this.menuRadius = parseInt(window.getComputedStyle(this.$radialMenu.querySelector('.radial-menu-wrapper'), null).getPropertyValue('width'), 10) / 2;
    this.itemRadius = parseInt(window.getComputedStyle(this.$radialMenu.querySelector('.radial-menu-item'), null).getPropertyValue('width'), 10) / 2;

    this.init();
  }

  init() {
    this.setUpRadialMenuItems();
    this.addEventListenersToRadialMenu();

    // activate radial menu when right click on svg
    this.$svgs.forEach(($svg) => {
      d3.select($svg)
        .on('contextmenu', (event) => {
          this.openRadialMenu(event);
        });

      this.iOSAddonEvents($svg);
    });
  }

  static hasText($svg) {
    const svgSpecificActions = $svg.getAttribute('data-svg-target').split(' ');
    return svgSpecificActions.includes('text');
  }

  static hasMoreColors($svg) {
    const colors = $svg.getAttribute('data-svg-colors');
    const svgSpecificColor = colors ? colors.split(' ') : undefined;
    return (svgSpecificColor && svgSpecificColor.length > 1) || !colors;
  }

  iOSAddonEvents($svg) {
    // now it helping to fix to not selext text when menu display on comment
    // it is depand on timeout for device hold selection event
    // chosen experimentally
    // TODO: find out proper way to define constant
    const delay = 400;
    // https://www.geeksforgeeks.org/detect-a-device-is-ios-or-not-using-javascript/
    // https://github.com/victorqribeiro/radialMenu/blob/master/src/RadialMenu.js#L437
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      console.log('This is a IOS device');
      let timer;

      // circle events
      document.addEventListener('event.propagation', (e) => {
        const event = e.detail.event.data.sourceEvent;

        timer = setTimeout(() => {
          event.preventDefault();
          this.openRadialMenu(event);
        }, delay);
      });

      document.addEventListener('event.stopPropagation', () => {
        if (timer) clearTimeout(timer);
      });

      // image events
      // d3 listeners are wrong option because they have stopPropagation
      // where we dont need
      // d3.select($svg).on('touchstart', ()=>{}).on('touchmove', ()=>{})...
      $svg.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) {
          timer = setTimeout(() => {
            event.preventDefault();
            event.stopPropagation();
            this.openRadialMenu(event);
          }, delay);
        }
      });
      $svg.addEventListener('touchmove', () => {
        if (timer) clearTimeout(timer);
      });
      $svg.addEventListener('touchend', () => {
        if (timer) clearTimeout(timer);
      });
      $svg.addEventListener('touchcancel', () => {
        if (timer) clearTimeout(timer);
      });
    }
  }

  openRadialMenu(event) {
    const $svg = event.target.closest('svg');
    const hasText = SVGRadialMenu.hasText($svg);
    const hasMoreColors = SVGRadialMenu.hasMoreColors($svg);

    // fix for drawing and helpful for touch devices
    const $clickedItem = SVG.findNearElements(event);
    // mark this SVG as the active one
    SVG.activate($svg);
    // deselect all previously selected items
    SVG.deselectItem();
    // show radial menu buttons based on clicked element
    // and .select appropriate elements based on clicked element
    this.filterMenuButtons($clickedItem, hasText, hasMoreColors);
    this.showRadialMenu(event, $svg);
    // prevent default 'contextmenu' event
    event.preventDefault();

    // for removing text selection
    // no inpact for PC
    window.getSelection().removeAllRanges();
    this.initialSetUp = false;
  }

  setUpRadialMenuItems() {
    // this.positionRadialMenuItems(this.$radialMenuItems);

    this.$radialMenuItems.forEach(($item) => {
      this.addEventListenersToRadialMenuItem($item);
    });
  }

  positionRadialMenuItems($items) {
    const _itemsLength = $items.length;
    const _menuRadius = this.menuRadius;
    const _itemRadius = this.itemRadius;
    const _menuOffset = _menuRadius - _itemRadius;
    const _interval = 0.6283185307;
    // if more items center them
    const _centerOffset = (-_interval / 2) + ((_itemsLength * _interval) / 2);

    // make a "flower"
    $items.forEach(($item, index) => {
      // Calculate the angle at which the element will be placed.
      // For a semicircle, we would use (index / _itemsLength) * Math.PI.
      const angle = (Math.PI + ((index * _interval) * -1)) + _centerOffset;

      // get position
      const x = (_menuRadius * Math.sin(angle)) + _menuOffset;
      const y = (_menuRadius * Math.cos(angle)) + _menuOffset;

      $item.style.left = `${x.toFixed(1)}px`;
      $item.style.top = `${y.toFixed(1)}px`;

      // if (this.initialSetUp === true) {
      //   this.addEventListenersToRadialMenuItem($item);
      // }
    });
  }

  addEventListenersToRadialMenu() {
    this.onMouseLeave();

    this.$radialMenu.addEventListener('click', (event) => {
      this.hideRadialMenu(this.$radialMenu);
      event.preventDefault();
    });

    this.$radialMenu.addEventListener('contextmenu', (event) => {
      this.hideRadialMenu(this.$radialMenu);
      event.preventDefault();
    });
  }

  addEventListenersToRadialMenuItem(item) {
    const $item = item;

    // actions
    const action = $item.getAttribute('data-radial-menu-item');
    // remove item
    if (action === 'remove-content') {
      $item.addEventListener('click', () => {
        SVG.removeItem(true);
        this.hideRadialMenu();
      }, false);
    }
    // create user text
    else if (action === 'create-text') {
      d3.select($item).on('click', () => {
        SVGText.createText();
        this.hideRadialMenu();
      }, false);
    }
    // označit podobnost
    else if (action === 'color-point-blue') {
      $item.addEventListener('click', () => {
        SVGRadialMenu.changeColor('blue');
        this.hideRadialMenu();
      }, false);
    }
    // označit rozdil
    else if (action === 'color-point-red') {
      $item.addEventListener('click', () => {
        SVGRadialMenu.changeColor('red');
        this.hideRadialMenu();
      }, false);
    }
    // označit rozdil
    else if (action === 'color-point-red') {
      $item.addEventListener('click', () => {
        SVGRadialMenu.changeColor('red');
        this.hideRadialMenu();
      }, false);
    }
    // přiřadit kategorii
    // else if (action === 'category') {
    //   const category = $item.getAttribute('data-category');
    //   const categoryLabel = $item.getAttribute('data-radial-menu-item-tooltip');

    //   $item.addEventListener('click', () => {
    //     const $selected = document.querySelector('[data-svg-selected="true"]');
    //     const $parentForeignObject = $selected.parentElement;
    //     let $category = $parentForeignObject.querySelector('.svg-category-label');

    //     $selected.setAttribute('data-svg-category', category);

    //     if (!$category) {
    //       $category = document.createElement('div');
    //       $category.classList.add('svg-category-label');
    //       $parentForeignObject.prepend($category);
    //     }

    //     $category.innerText = categoryLabel;

    //     this.hideRadialMenu();
    //   }, false);
    // }

    // tooltip
    $item.addEventListener('mouseenter', (event) => {
      this.$tooltip.innerHTML = event.currentTarget.getAttribute('data-radial-menu-item-tooltip');
      this.$tooltip.style.display = 'block';
    }, false);
    $item.addEventListener('mouseleave', () => {
      this.$tooltip.innerHTML = '';
      this.$tooltip.style.display = 'none';
    }, false);
  }

  // Draw a SVG circle on click
  static changeColor(color, element = '[data-svg-selected="true"]') {
    let $element = document.querySelector(element);
    if(!$element)return;
    let nodeName = $element.nodeName;
    let taskType = 'color';

    __removeClass($element, 'red blue');
    __addClass($element, color);
    $element.setAttribute('data-svg-color', color);

    // DIV => text field  or circle
    switch (nodeName) {
      case 'path':
      case 'circle':
        // $element = $element;
        break;
      case 'DIV':
        if ($element.parentElement.childNodes[1]) {
          $element = $element.parentElement.childNodes[1];
        } else {
          $element = $element.parentElement;
        }
        nodeName = $element.nodeName;
        break;
      default:
        console.log('Nondefinated node type. :(', nodeName);
    }

    // if clone is changed, then dispatch create event
    // if it is comments mark
    if (nodeName === 'circle' && $element.id.includes('svg-text')) {
      const commentID = $element.id.replace('-circle', '');
      const $comment = document.querySelector(`#${commentID}`);
      SVG.removeCloneConnectionManager($comment);
    }

    if (SVG.removeCloneConnectionManager($element)) {
      taskType = 'create';
    }

    // get svg id from object id
    const svgID = $element.id.split('_')[0];

    // dispatch event that svg has changed
    __dispatchEvent(document, 'svg.change', {}, {
      svg: {
        id: svgID,
        task: taskType,
        node: $element,
        nodeName,
        contextMenu: true,
        color,
      },
    });
  }

  showRadialMenu(event, $activeSVG) {
    const $svg = $activeSVG || document.querySelector('[data-svg-active="true"]');
    // get global position of the right click event
    const globalPosition = __globalPosition(event);
    const localPosition = __localPosition(event, $svg);
    this.$radialMenu.setAttribute('data-local-x', localPosition.x);
    this.$radialMenu.setAttribute('data-local-y', localPosition.y);
    // set position of radial menu
    // number of 13 is size of #radial-menu
    this.$radialMenu.style.top = `${globalPosition.y - 7}px`;
    this.$radialMenu.style.left = `${globalPosition.x - 7}px`;

    // make a flower
    const $activeRadialMenuItem = this.$radialMenu.querySelectorAll('.is-active');
    this.positionRadialMenuItems($activeRadialMenuItem);

    // show radial menu
    __addClass(this.$radialMenu, 'is-active');

    // return {
    //   localPosition,
    //   globalPosition,
    // };
  }

  hideRadialMenu() {
    // hide radial menu
    __removeClass(this.$radialMenu, 'is-active');
    // deactivate all SVGs
    SVG.deactivate();
    // deselect all SVG items
    SVG.deselectItem();

    // deactivate radial menu items when the menu is hidden
    setTimeout(() => {
      if (!__hasClass(this.$radialMenu, 'is-active')) {
        this.$radialMenuItems.forEach(($item) => {
          __removeClass($item, 'is-active');
        });
      }
    }, 150);
  }

  onMouseLeave() {
    let mouseLeaveDelay;

    this.$radialMenu.addEventListener('mouseleave', () => {
      mouseLeaveDelay = setTimeout(() => {
        this.hideRadialMenu(this.$radialMenu);
      }, 500);
    });

    this.$radialMenu.addEventListener('mouseenter', () => {
      clearTimeout(mouseLeaveDelay);
    });
  }

  filterMenuButtons(clickedItem, hasText, hasMoreColors) {
    if (__hasClass(clickedItem, 'svg-path') || clickedItem.nodeName === 'path') {
      if (hasText) {
        __addClass(this.$createTextItem, 'is-active');
      } else {
        __removeClass(this.$createTextItem, 'is-active');
      }
      // __addClass(this.$removeItem, 'is-active');

      if (hasMoreColors) {
        this.$colorItems.forEach(($colorItem) => {
          __addClass($colorItem, 'is-active');
        });
      }

      this.$textItems.forEach(($textItem) => {
        __removeClass($textItem, 'is-active');
      });

      // mark it as slected
      // SVG.selectItem(clickedItem);
    }
    if (__hasClass(clickedItem, 'svg-circle')) {
      if (hasText) {
        __addClass(this.$createTextItem, 'is-active');
      } else {
        __removeClass(this.$createTextItem, 'is-active');
      }
      // __addClass(this.$removeItem, 'is-active');

      if (hasMoreColors) {
        this.$colorItems.forEach(($colorItem) => {
          __addClass($colorItem, 'is-active');
        });
      }

      this.$textItems.forEach(($textItem) => {
        __removeClass($textItem, 'is-active');
      });

      // mark it as slected
      // SVG.selectItem(clickedItem);
    }
    if (__hasClass(clickedItem, 'svg-textarea')) {
      __removeClass(this.$createTextItem, 'is-active');
      // __addClass(this.$removeItem, 'is-active');

      if (!__hasClass(clickedItem, 'do-not-remove')) {
        this.$colorItems.forEach(($colorItem) => {
          __removeClass($colorItem, 'is-active');
        });

        this.$textItems.forEach(($textItem) => {
          __addClass($textItem, 'is-active');
        });
      }

      // mark it as slected
      // SVG.selectItem(clickedItem);
    }
    if (clickedItem.nodeName === 'image') {
      if (hasText) {
        __addClass(this.$createTextItem, 'is-active');
      } else {
        __removeClass(this.$createTextItem, 'is-active');
      }

      __removeClass(this.$removeItem, 'is-active');

      this.$colorItems.forEach(($colorItem) => {
        __removeClass($colorItem, 'is-active');
      });

      this.$textItems.forEach(($textItem) => {
        __removeClass($textItem, 'is-active');
      });
    }
    else {
      if (__hasClass(clickedItem, 'do-not-remove')) {
        __removeClass(this.$removeItem, 'is-active');
      } else {
        if (hasText) {
          __addClass(this.$createTextItem, 'is-active');
        } else {
          __removeClass(this.$createTextItem, 'is-active');
        }
        __addClass(this.$removeItem, 'is-active');
      }
      // mark it as slected
      SVG.selectItem(clickedItem);
    }
  }
}