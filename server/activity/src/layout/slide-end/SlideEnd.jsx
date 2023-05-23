import UserTextModule from "../../modules/userText/UserTextModule.jsx";
import './_slide-end.scss';
import TacrSvg from "../svgs/TacrSvg.jsx";
import { useContext } from "react";
import SaveDataContext from "../../SaveDataContext.jsx";
import IconAngleSvg from "../svgs/IconAngleSvg.jsx";

/**
 * Export slide. Render end question and Button for save activity. Original application.
 * */
function SlideEnd({ data }) {

  const {
    stateOfActivity,
    updateStateOfActivityActiveSlide
  } = useContext(SaveDataContext);

  const notes = {
    "questions": [
      {
        "id": "end-question",
        "instruction": "Napadlo mě, že...",
        "minLength": 0,
        "maxLength": 999,
        "height": 4,
      }
    ]
  }

  return (
    <section className={ `slide next-slide slide-export` }
             id={ `slide-export` }>
      <a className={`nav-button nav-button-prev nav-left`}
         data-save-button="" data-nav-button="prev"
         title= {``}
         onClick={ () => {
           setTimeout(()=> {
             updateStateOfActivityActiveSlide(document.querySelector(".active-slide").id)
           },0)
         }}
      >
        <span>
          předchozí
        </span>
        <i className={`icon-svg`}>
          <IconAngleSvg />
        </i>
      </a>

      <div className={ `row` }>
        <div className={ `overlay` }
             style={ { backgroundImage: `url(/pics/${ data.introductoryImage })` } }></div>

        <div className={ `content` }>
          <div className={ `content__item show-when-done hidden` }>
            <div className={ `zadani` }>
              <h1 data-form={ "about-user-email" }>Konec vyplněného cvičení od
                neznámý uživatel</h1>
            </div>

          </div>

          <div className={ `content__item show-when-done` }>
            <div className={ `zadani` }>
              <h1 data-form={ "about-user-email" }>Výborně! Úspěšně jste prošli
                celým cvičením.</h1>
            </div>
          </div>

          <div className={ `content__item` }>
            <h3>Napadlo vás k tématu cvičení něco dalšího?</h3>
            <UserTextModule userText={ notes }/>
          </div>


          <div className={ `content__item show-when-done hidden` }>
            <button className={ `button tertiary` } type="button"
                    data-nav-button="prev" tabIndex="-1">
              vrátit se a ještě prohlédnout
            </button>
          </div>

          <div className={ `content__item show-when-done` }>
            <button className={ `button tertiary` } type="button"
                    data-nav-button="prev" tabIndex="-1">
              vrátit se a ještě prohlédnout
            </button>
          </div>

          <div className={ `content__item show-when-done` }>
            <div id={ `form-to-send` }>
              { !stateOfActivity.viewOnly &&
                <button className={ `button button-ok` } type={ "submit" }
                        data-save-button={ "submit" } tabIndex={ "-1" }
                        data-saving={ `ukládám` }>Uložit cvičení
                </button> }
            </div>
            <button className={ `button tertiary` } type="button"
                    data-nav-button="prev" tabIndex="-1">
              … nebo se vrátit zpět a vylepšit ho
            </button>
          </div>
        </div>

        <div className={ `privacy-policy` }>Klinutím na tlačítko „Uložit
          cvičení“ souhlasíte se zpracováním osobních údajů a poskytnutím
          výsledků cvičení k dalšímu výzkumu a vývoji aplikace Historylab.
          Informace o zpracování osobních údajů naleznete <a
            href="https://historylab.cz/informace-o-zpracovani-osobnich-udaju.html"
            target="_blank">zde</a>.
        </div>
        <div className={ `tacr` }>
          <TacrSvg/>
          <p className={ `tacr-text` }>
            Projekt vznikl díky grantu Technologické agentury ČR
          </p>
        </div>

      </div>
    </section>
  )
}

export default SlideEnd