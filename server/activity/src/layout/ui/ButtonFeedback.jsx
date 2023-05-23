import { useContext } from "react";
import SaveDataContext from "../../SaveDataContext.jsx"
/**
 * Component of button with slide feedback (not feedback from teacher). In my prototype it is only basic button of navigation.
 * */
function ButtonFeedback({data = {done: false, default: false, hover: false}}) {
  const textDefault = data.default || "Default feedback"
  const textOnHover = data.hover || "Hover feedback"

  const {
    updateStateOfActivityActiveSlide
  } = useContext(SaveDataContext);
  return (
    <button className={`button button-ok hide-on-previous-slide`}
            data-save-button="" data-nav-button="next" title= {`hotkeys: 'space', 'enter', '→'`} data-feedback-button= {textDefault} data-done={data.done }
            onClick={ () => {
              setTimeout(()=> {
                updateStateOfActivityActiveSlide(document.querySelector(".active-slide").id)
              },0)
            }}

    >
      <span>{textDefault}</span>
    </button>
  )
}

export default ButtonFeedback