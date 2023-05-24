import { useState, useEffect, useRef, useContext } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

import SVGModule from "./modules/svg/SVGModule.jsx";
import './scss/styles.scss';
import RadialMenu from "./modules/svg/RadialMenu.jsx";
import './scss/cviceni/_slide.scss';
import Header from "./layout/header/Header.jsx";
import SlideInitial from "./layout/slide-initial/SlideInitial.jsx";
import ButtonFeedback from "./layout/ui/ButtonFeedback.jsx";
import Navigation from "./layout/navigation/Navigation.jsx";
import Slides from "./layout/slide/slides.js";
import NavigationJs from "./layout/navigation/navigation.js";
import Assignment from "./layout/task/Assignment.jsx";
import Cviceni from "./layout/cviceni.js";
import Tutorial from "./layout/tutorial/Tutorial.jsx";
import FeedbackTeacher from "./layout/feedback-teacher/FeedbackTeacher.jsx";
import SourcesModule from "./modules/sources/SourcesModule.jsx";
import UserTextModule from "./modules/userText/UserTextModule.jsx";
import SlideEnd from "./layout/slide-end/SlideEnd.jsx";
import SaveDataContext from "./SaveDataContext.jsx";
import * as DataService from "./DataService.js";

// Metadata of testing activity.
import metadata from "./assets/promeny-obce-horni-vysoke.json"

/**
 * Component of Activity.
 *
 * */
function App() {
  const [searchParams] = useSearchParams();
  const { slug, modeOfActivity, entryId } = useParams();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(null);

  const {
    stateOfActivity,
    saveDataModule,
    modulesData,
    updateStateOfActivity,
    feedbackData,
    updateFeedbackData,
    updateModulesData
  } = useContext(SaveDataContext);

  // When load, fetch state and other data from server.
  useEffect(() => {
    const fetchData = async () => {
      const response = await DataService.fetchStateOfActivityMetadata(slug, modeOfActivity, entryId);
      updateStateOfActivity(response.stateOfActivity);
      updateFeedbackData(response.feedbackData);
      updateModulesData(response.modulesData);
    }
    fetchData().then(() => setLoaded(true)).catch(console.error);
  }, []);

  const dataFetchedRef = useRef(modulesData);
  useEffect(() => {
    dataFetchedRef.current = modulesData;
  }, [modulesData]);

  // Formik setup and method on submit form.
  const formik = useFormik({
    initialValues: feedbackData[`submission${ stateOfActivity.submission }`] || {},
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      let dataToSend = {};
      try {
        // If activity is in feedback mode.
        if (modeOfActivity === "zpetna-vazba") {
          dataToSend.entryId = entryId || null;
          dataToSend.feedbackData = values;
          const response = await DataService.fetchPostActivityData(dataToSend);
          if (response.message) {
            toast.info(response.message);
          } else {
            alert(JSON.stringify(response));
          }
          navigate("/");
          return;
        }

        // Save data from each module.
        let modulesData = {}
        saveDataModule.forEach(module => {
            const a = module.saveData(module.reference.current);
            modulesData = { ...modulesData, ...a }
          }
        );
        dataToSend.studentName = searchParams.get("student") || "";
        dataToSend.modulesData = modulesData;
        dataToSend.entryId = entryId || null;
        if (modeOfActivity === "uprava") {
          dataToSend.parentSubmissionEntryId = entryId || null;
          dataToSend.entryId = null;
        }
        const response = await DataService.fetchPostActivityData(dataToSend);
        navigate("/");
        if (response.message) {
          toast.info(response.message);
        } else {
          alert(JSON.stringify(response));
        }
      } catch (e) {
        console.log("Error: ", e);
      }
      setSubmitting(false)
    },
    enableReinitialize: true
  });

  // Render activity when data from server is loaded and ready. Add listeners and other methods from original repository cvičení.
  useEffect(() => {
    if (!loaded) return;
    const slideJs = new Slides;
    slideJs.slides();
    const cviceniJS = new Cviceni();
    cviceniJS.header();
    const navigationJs = new NavigationJs();
    navigationJs.loopNavButtons();
    updateStateOfActivity({ formik });
  }, [loaded]);


  // Render each slide in activity by given data.
  const renderSlides = (slides) => {
    return slides.map((slide, index) => {
      return <div className={ `slide ${ slide.class ? slide.class : "" }` }
                  key={ `${ index }` }
                  id={ slide.id || `${ metadata.activity.slug }-${ index + 1 }` }>
        <Navigation data={ { currentSlide: index + 1, all: slides.length } }/>
        <Assignment data={ slide.assignment }/>
        <Tutorial data={ slide.tutorial }/>
        { slide.svg &&
          <SVGModule key={ `svg-${ index }` } svgs={ slide.svg }/> }
        { slide.sources && <SourcesModule key={ `sources-${ index }` }
                                          sources={ slide.sources }/> }
        { slide.userText && <UserTextModule key={ `userText-${ index }` }
                                            userText={ slide.userText }/> }
        { slide.labels && <div className={ `row captions mb-3` }>
          <div className={ `item caption` }>
            <p>{ slide.labels[0] }</p>
          </div>
        </div>
        }
        <div className={ `navigation-with-feedback` }>
          <ButtonFeedback
            data={ { default: "Mám hotovo!", hover: "Další slajd →" } }/>
        </div>
      </div>
    })
  }

  return (
    <>
      { loaded &&
        <FormikProvider value={ formik }>
          <form onSubmit={ formik.handleSubmit }>
            <Header data={ metadata.activity } formik={ formik }/>
            <main className={ `cviceni slides` } id={ metadata.activity.slug }
                  data-exercise-id={ metadata.activity.id }>
              <SlideInitial data={ metadata.activity }/>
              { renderSlides(metadata.slides) }
              <SlideEnd data={ metadata.activity }/>
            </main>
            { !stateOfActivity.viewOnly &&
              <RadialMenu slides={ metadata.slides }/> }
            { (feedbackData && (stateOfActivity.submission === 1 && feedbackData.submission1 || stateOfActivity.submission === 2) || stateOfActivity.user === "teacher") &&
              <FeedbackTeacher formik={ formik }/> }
          </form>
        </FormikProvider>
      }
    </>
  );

}

export default App