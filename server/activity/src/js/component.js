/**
 * Class of activity component. Provide main methods. Origin appllication.
 * */
export default class Component {
  constructor($element) {
    this.target = $element;
    this.$slide = this.target.closest('.slide');
    this.lang = document.documentElement.getAttribute('lang');
    return;
    // Not necessary for my prototype.
    if (!HISTORYLAB.import.done) {

      if (this.$slide) {
        this.$buttonFeedback = this.$slide.querySelector('[data-feedback-button]');

        if (this.$buttonFeedback) {
          this.$buttonFeedbackText = this.$buttonFeedback.querySelector('span');
        }
      }
      this.showFeedback = this.showFeedback.bind(this);
    }
  }

  showFeedback() {
    return
    if (this.$buttonFeedback && this.$buttonFeedback.classList.contains('button-hidden')) {
      this.$buttonFeedback.classList.remove('button-hidden');
    }
  }

  hideFeedback() {
    return
    this.$buttonFeedback.classList.add('button-hidden');
  }
}