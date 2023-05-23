import ButtonFeedback from "../ui/ButtonFeedback.jsx";
import "./_slide-initial.scss";

/**
 * Initial slide. Render annotation and other information of activity. Original application.
 * */
function SlideInitial({data}) {
  const defaultWelcomeText = "Anotace chybi" //t.slideForm.default.missingAnotation[lang]
  const welcomeText = (data.annotation && data.annotation.public) ? data.annotation.public : defaultWelcomeText

  return (
    <section className={`slide active-slide visited-slide slide-initial` } id={ `slide-initial` }>

      <div className={`overlay`} style={{backgroundImage: `url(/pics/${data.introductoryImage})`}}></div>
      <div className={`content`}>
        <div className={`zadani`}>
          <div className={`h6`}>
            <span data-done={`DONE WELCOME`}>Vítejte ve cvičení</span>
            <span className={`show-when-done hidden`} data-form={ "about-user-email" }>- completedBy</span>
          </div>
          <h1>
            {data.name}
          </h1>
          <p>
            {welcomeText}
          </p>
        </div>

        <ButtonFeedback data={{default: "Mám přečteno", hover: "Pustit se do práce →"}}/>
      </div>
    </section>
  )
}

export default SlideInitial