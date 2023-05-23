import { __addClass, __removeClass, specialClasses } from '../js/lib/utils';

/**
 * Main component of Activity. All modules inherit its methods. Origin application.
 * */
export default class Cviceni {
  constructor() {
    this.$cviceni = document.querySelector('.cviceni');
    this.$header = document.querySelector('#header');
    this.$saveButtons = document.querySelectorAll('[data-save-button]');
    this.$exportSaveButton = document.querySelector('[data-save-button="submit"]');
    this.$buttonFeedbacks = document.querySelectorAll('[data-feedback-button]');
    this.nav = {
      $prev: this.$cviceni.querySelectorAll('[data-nav-button="prev"]'),
      $next: this.$cviceni.querySelectorAll('[data-nav-button="next"]'),
    };
    this.$slides = this.$cviceni.querySelectorAll('.slide');
    this.$activeSlide = this.$cviceni.querySelector('.active-slide');
    this.$initialSlide = this.$cviceni.querySelector('#slide-initial');
    this.$exportSlide = this.$cviceni.querySelector('#slide-export');
    this.$formToSend = this.$cviceni.querySelector('#form-to-send');

    this.urlParams = new URL(document.location).searchParams;

    return;
    // Not necessary for my prototype
    this.import = HISTORYLAB.import;
    this.isDone = this.import.done === true;
    this.isExhibition = this.urlParams.get('exid') !== null;

    this.analytics = {
      time: {
        start: {
          date: 0,
          time: 0,
        },
        end: {
          date: 0,
          time: 0,
        },
        timeSpent: 0,
      },
      activity: {
        length: 0,
        steps: [],
      },
    };
  }

  header() {
    const headerHeight = this.$header.offsetHeight;
    let y0 = 0;

    const hideHeader = (event, $item) => {
      const y = $item.scrollTop;

      if (y > headerHeight && y > y0) {
        __addClass(this.$header, 'is-hidden');
        y0 = y;
      }
      else if (y < y0 - 200 || y <= headerHeight) {
        __removeClass(this.$header, 'is-hidden');
        y0 = y;
      }
    };

    for (let i = 0; i < this.$slides.length; i += 1) {
      this.$slides[i].removeEventListener('scroll', hideHeader);
    }

    this.$activeSlide = this.$cviceni.querySelector('.active-slide.slide');
    let y = this.$activeSlide.scrollTop;

    if (y <= headerHeight) {
      __removeClass(this.$header, 'is-hidden');
    } else {
      __addClass(this.$header, 'is-hidden');
    }

    if (this.$activeSlide) {
      this.$activeSlide.addEventListener('scroll', (event) => hideHeader(event, this.$activeSlide));
    }
  }

  fixClassesAfterDirectURL(currentHash) {
    // remove all special classes
    let currentSlide = -1;
    for (let i = 0; i < this.$slides.length; i += 1) {
      this.$slides[i].classList.remove(...specialClasses);
      // set current num of slide
      // fix for all slides with different names
      if (this.$slides[i].id === currentHash) currentSlide = i;
    }

    // fix for non exists slides
    if (currentSlide === -1) {
      currentSlide = 0;
      window.location.hash = `#${this.$slides[0].id}`;
    }

    // add right classes to slides
    for (let i = 0; i < this.$slides.length; i += 1) {
      this.$slides[i].setAttribute('data-slide-index', i);

      if (i < currentSlide - 1) {
        __addClass(this.$slides[i], 'previous-slide');
      } else if (i + 1 === currentSlide) {
        __addClass(this.$slides[i], 'previous-to-active-slide');
      } else if (i === currentSlide) {
        const activeSlideHash = `#${this.$slides[i].id}`;
        if (window.history.replaceState) {
          window.history.replaceState(null, null, activeSlideHash);
        } else {
          window.location.hash = activeSlideHash;
        }

        __addClass(this.$slides[i], 'active-slide');
      } // next slides
      else {
        __addClass(this.$slides[i], 'next-slide');
      }
    }
  }

  static loadingScreen() {
    const $body = document.querySelector('.loading');
    const $loadingScreen = document.querySelector('#loading-screen');
    const loaded = JSON.parse($loadingScreen.getAttribute('data-loaded'));
    const $h1 = $loadingScreen.querySelector('h1');

    setTimeout(() => {
      $h1.innerText = loaded.h1;
    }, 300);

    __removeClass($body, 'loading');
  }
}