/* eslint-disable brace-style */
import hotkeys from 'hotkeys-js';
import {
  __hasClass, __addClass, __removeClass, __dispatchEvent
} from '../../js/lib/utils';
import Cviceni from '../cviceni';
import { useContext } from "react";
import SaveDataContext from "../../SaveDataContext.jsx";

// Description:
// ======================================================
// Navigation
// consists from:
// - prev/next button
// - history
// affects:
// - slides
// - pagination (generated in build process)
// - prev/next button (moved inside slides)
// - history
// ——————————————————————————————————————————————————————
// .slide CSS classes
// - .active-slide
// - .previous-slide
// - .next-slide
// - .visited-slide
// - .half-slide-active (.slide is on the right when is .active-slide)
// - .half-slide-previous (.slide is on the left when .previous-slide)
// - .previous-to-active-slide (mark the most recently viewed .slide)
// ======================================================
/**
 * Class which handle change of slide and save analytics. Origin application.
 *
 * */
export default class NavigationJs extends Cviceni {
  constructor() {
    super();
    // bind the context of an event listener
    this._clickPrev = this._clickPrev.bind(this);
    this._clickNext = this._clickNext.bind(this);

    // fix tabbing
    document.querySelectorAll('div').forEach(($div) => {
      $div.setAttribute('tabindex', -1);
      $div.style.outline = '0';
    });

    // History (back & forward buttons)
    // A popstate event is dispatched to the window each time the active history entry changes between two history entries for the same document. If the activated history entry was created by a call to history.pushState(), or was affected by a call to history.replaceState(), the popstate event's state property contains a copy of the history entry's state object.
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate

    window.onpopstate = (event) => {
      this.analytics = {};
      const $activeSlide = this.$cviceni.querySelector('.active-slide');
      const activeSlideIndex = $activeSlide.getAttribute('data-slide-index');
      const $newSlide = this.$cviceni.querySelector(window.location.hash);

      // check if the slide in url was already visited to prevent user to see slides which wasnt visited yet
      // AND
      // check if the new slide isnt tha same one
      if (($newSlide && __hasClass($newSlide, 'visited-slide')) && ($newSlide.id !== $activeSlide.id)) {
        const newSlideIndex = $newSlide.getAttribute('data-slide-index');
        __removeClass($activeSlide, 'active-slide');

        this.constructor.enableTabControlOnActiveSlide($newSlide, $activeSlide);

        // going back
        if (activeSlideIndex > newSlideIndex) {

          // slide
          __addClass($activeSlide, 'next-slide');
          __removeClass($newSlide, 'previous-slide');

          if (__hasClass($newSlide, 'previous-to-active-slide')) {
            __removeClass($newSlide, 'previous-to-active-slide');
          }
          if (__hasClass($newSlide.previousElementSibling, 'half-slide-previous')) {
            __addClass($newSlide.previousElementSibling, 'previous-to-active-slide');
          }
        }
        // going forward
        else {

          // slides
          __addClass($activeSlide, 'previous-slide');
          __removeClass($newSlide, 'next-slide');

          if (__hasClass($activeSlide, 'half-slide-previous')) {
            __addClass($activeSlide, 'previous-to-active-slide');
          }
          if (__hasClass($activeSlide.previousElementSibling, 'previous-to-active-slide')) {
            __removeClass($activeSlide.previousElementSibling, 'previous-to-active-slide');
          }
        }

        __addClass($newSlide, 'active-slide');

        // // dispatch event that slide has changed
        // __dispatchEvent(this.$cviceni, 'slide.change', {}, { slide: { active: this.getActiveSlide($newSlide) } });

      } else if (!__hasClass($newSlide, 'visited-slide')) {
        if (HISTORYLAB.import.done) {
          // trouble with something - show part of slide and last slide
          // fix - web refresh - redirect to more successful part of code
          window.location.reload(true);
        } else {
          const activeSlideHash = `#${$activeSlide.id}`;
          if (window.history.replaceState) {
            window.history.replaceState(null, null, activeSlideHash);
          } else {
            window.location.hash = activeSlideHash;
          }
        }
      }

      // HISTORYLAB.analytics.data = this.analytics;
    };
  }

  getActiveSlide($slide = false) {
    const $slideActive = $slide || this.$cviceni.querySelector('.active-slide');
    const slideActiveData = {
      element: $slideActive,
      id: $slideActive.id,
      index: parseInt($slideActive.getAttribute('data-slide-index'), 10),
    }
  }

  static enableTabControlOnActiveSlide($activeSlide, $oldSlide) {
    const $activeTextareas = $activeSlide.querySelectorAll('textarea');
    const $oldTextareas = $oldSlide.querySelectorAll('textarea');

    $oldTextareas.forEach(($textarea) => {
      $textarea.setAttribute('tabindex', -1);
    });
    $activeTextareas.forEach(($textarea) => {
      $textarea.setAttribute('tabindex', 0);
    });
  }

  loopNavButtons() {
    this.nav.$prev.forEach(($prev) => {
      $prev.addEventListener('click', this._clickPrev, false);
    });
    this.nav.$next.forEach(($next) => {
      $next.addEventListener('click', this._clickNext, false);
    });

    this.buttonFeedbackOnHover();
  }

  _both() {
    this.header();
    this.constructor.hideAllOpenComments();
  }

  static hideAllOpenComments() {
    const $comments = document.querySelectorAll('.comment:not(.hidden)');

    $comments.forEach(($comment) => {
      $comment.querySelector('.close').click();
    });
  }

  _clickPrev(event) {
    // get active slide on every click
    const $activeSlide = this.$cviceni.querySelector('.active-slide');
    const $previousSlide = $activeSlide.previousElementSibling;
    const $previousToActiveSlide = this.$cviceni.querySelector('.previous-to-active-slide');

    // zkontroluj zda nějaký další slajd existuje
    if (!__hasClass($previousSlide, 'slide')) {
      // pokud ne
      // __addClass($prev, 'is-hidden');
    } else {
      // pokud ano

      // slides
      __removeClass($activeSlide, 'active-slide');
      __addClass($activeSlide, 'next-slide');

      __removeClass($previousSlide, 'previous-slide');
      __addClass($previousSlide, 'active-slide');

      this.constructor.enableTabControlOnActiveSlide($previousSlide, $activeSlide);

      if ($previousToActiveSlide) {
        __removeClass($previousToActiveSlide, 'previous-to-active-slide');
      }
      if ($previousSlide.previousElementSibling) {
        __addClass($previousSlide.previousElementSibling, 'previous-to-active-slide');
      }

      // dispatch event that slide has changed
      __dispatchEvent(this.$cviceni, 'slide.change', {}, { slide: { active: this.getActiveSlide($previousSlide) } });

      this._both();
      // save slide to history
      this._saveActiveSlideToHistory();
    }

    event.preventDefault();
  }

  _clickNext(event) {
    // get active slide on every click
    const $activeSlide = this.$cviceni.querySelector('.active-slide');
    // const $previousSlide = $activeSlide.prevElementSibling;
    const $previousToActiveSlide = this.$cviceni.querySelector('.previous-to-active-slide');
    const $nextSlide = $activeSlide.nextElementSibling;
    // const $previousSlide = $activeSlide.previousElementSibling;

    // zkontroluj zda nějaký další slajd existuje
    if (!__hasClass($nextSlide, 'slide')) {
      // pokud ne
      // __addClass($next, 'is-hidden');
    } else {
      // pokud ano

      // slides
      __removeClass($activeSlide, 'active-slide');
      __addClass($activeSlide, 'previous-slide previous-to-active-slide');

      __removeClass($nextSlide, 'next-slide');
      __addClass($nextSlide, 'active-slide visited-slide');

      this.constructor.enableTabControlOnActiveSlide($nextSlide, $activeSlide);

      if ($previousToActiveSlide) {
        __removeClass($previousToActiveSlide, 'previous-to-active-slide');
      }

      // dispatch event that slide has changed
      // only for stop playing video and audio player
      //__dispatchEvent(this.$cviceni, 'slide.change', {}, { slide: { active: this.getActiveSlide($nextSlide) } });

      this._both();
      // save slide to history
      this._saveActiveSlideToHistory();
    }

    event.preventDefault();
  }

  buttonFeedbackOnHover() {
    this.$buttonFeedbacks.forEach(($buttonFeedback) => {
      const $buttonFeedbackText = $buttonFeedback.querySelector('span');
      const textDefault = "Hover"; //TODO JSON.parse($buttonFeedback.getAttribute('data-feedback-button'));
      let textCache = '';

      $buttonFeedback.addEventListener('mouseenter', (event) => {
        textCache = $buttonFeedbackText.innerText;
        const width = $buttonFeedback.offsetWidth;

        if (textCache !== textDefault) {
          $buttonFeedbackText.innerText = "Další"; //TODO TODO

          if (width > $buttonFeedback.offsetWidth) {
            $buttonFeedback.style.width = `${width}px`;
          }
        }
      });

      $buttonFeedback.addEventListener('mouseleave', (event) => {
        if (textCache !== textDefault) {
          $buttonFeedback.style.width = '';
          $buttonFeedbackText.innerText = textCache;
        }
      });
    });
  }

  _saveActiveSlideToHistory() {
    const activeSlideHash = `#${this.$cviceni.querySelector('.active-slide').id}`;
    // https://stackoverflow.com/a/14690177/2631749
    if (window.history.pushState) {
      window.history.pushState(null, null, activeSlideHash);
    } else {
      window.location.hash = activeSlideHash;
    }
  }
}