import { __addClass, __hasClass } from '../../js/lib/utils';
import Cviceni from '../cviceni';

/**
 * Class for managing slides in activity. Origin application.
 * */
export default class Slides extends Cviceni {
  constructor() {
    super();
  }

  // distribute CSS classesto all .slide elements
  slides() {
    const currentHash = window.location.hash.replace('#', '');
    // when excercise is done and current slide isnt first or last
    // fill classes to slides samely as user clicking to same slide
    if ( false && currentHash !== this.$slides[0].id) {


      this.fixClassesAfterDirectURL(currentHash);
    } else {
      for (let i = 0; i < this.$slides.length; i += 1) {
        this.$slides[i].setAttribute('data-slide-index', i);

        if (i === 0) {
          // __addClass(this.$slides[i], 'active-slide visited-slide');

          // set ID of the first slide as a hash to URL
          // history.replaceState() operates exactly like history.pushState() except that replaceState() modifies the current history entry instead of creating a new one.
          const activeSlideHash = `#${this.$slides[i].id}`;
          if (window.history.replaceState) {
            window.history.replaceState(null, null, activeSlideHash);
          } else {
            window.location.hash = activeSlideHash;
          }

        } else {
          __addClass(this.$slides[i], 'next-slide');
        }
      }
    }

    return this;
  }

  pagination() {
    const slides = this.$slides.length;

    this.$slides.forEach(($slide, index) => {
      const $zadani = $slide.querySelector('.zadani');
      const $h1 = $zadani.querySelector('h1');
      const $pagination = document.createElement('div');
      $pagination.classList.add('pagination');
      $pagination.innerHTML = `${index + 1}/${slides}`;
      $zadani.insertBefore($pagination, $h1);
    });
  }

}