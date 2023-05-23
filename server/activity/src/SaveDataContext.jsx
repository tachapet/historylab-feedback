import { createContext, useState, useCallback, useEffect } from "react";

import feedbackMetadata from "./assets/feedbackMetadata.json"

const SaveDataContext = createContext(undefined);

export const SaveDataProvider = ({ children }) => {

  // Data of modules. (For example: {userText1: "Odpoved zaka", svg: {data} })
  const [modulesData, setModulesData] = useState({});
  // Activity metadata, in this prototype used object from activities/src/assets/promeny-obce-horni-vysoke.json
  const [activityMetadata, setActivityMetadata] = useState({});
  // Array of modules in activity, with id, methods and references.
  const [saveDataModule, setStateSaveDataModule] = useState([]);

  /**
   * Variables which store states of activity
   * */
  const [stateOfActivity, setStateOfActivity] = useState({
    submissionView: 1, // Specification of shown view
    submission: 1, // Specification of submission number
    viewOnly: true, // Enable / disable modules
    user: "student", // Specification of user
    feedbackViewOnly: true, // Enable / disable feedback module
    currentSlide: "slide-initial",
    formik: null
  });

  const [feedbackData, setFeedbackData] = useState({});

  /**
   * Method which update data from modules.
   *
   * */
  const updateExerciseDataByModule = (idModule, moduleData) => {
    setModulesData((prevState) => {
      return {
        ...prevState, [`submission${ stateOfActivity.submission }`]: {
          ...prevState[`submission${ stateOfActivity.submission }`],
          [idModule]: moduleData
        }
      }
    });
  }

  /**
   * Method which save modules metadata (and references) into array.
   *
   * */
  const saveDataModuleIntoList = (idModule, reference, saveFunction) => {
    setStateSaveDataModule((prevState) => {
      return [
        ...prevState, {
          id: idModule,
          reference,
          saveData: saveFunction
        }
      ]
    });
  }

  /**
   * Setup current slide.
   * */
  const updateStateOfActivityActiveSlide = (currentSlide) => {
    setStateOfActivity((prevState) => {
        return { ...prevState, currentSlide }
      }
    );
  }

  /**
   * Update state of activity.
   * */
  const updateStateOfActivity = (
    updateData
  ) => {
    setStateOfActivity((prevState) => {
        return {
          ...prevState,
          ...updateData
        }
      }
    );
  }

  // When feedbackData is changed, set this data into formik values. Used when teacher is changing version of activity.
  useEffect(() => {
    if (!stateOfActivity.formik) return;
    stateOfActivity.formik.setValues(feedbackData[`submission${ stateOfActivity.submissionView }`] || {})
  }, [feedbackData]);

  /**
   * Used when teacher is changing version of activity. Loading feedbackData and render data from student.
   * */
  const updateStateOfActivityBySubmission = (submissionSelected, formik) => {

    if (submissionSelected === "1") {
      setStateOfActivity((prevState) => {
        return {
          ...prevState,
          feedbackViewOnly: true,
          submissionView: 1
        }
      });
      setFeedbackData((prevState) => {
        return { ...prevState, submission2: formik.values }
      })
    }
    if (submissionSelected === "2") {
      formik.setValues(feedbackData.submission2);
      setStateOfActivity((prevState) => {
          return { ...prevState, feedbackViewOnly: false, submissionView: 2 }
        }
      );
    }
  }

  /**
   * Update feedback data.
   * */
  const updateFeedbackData = (data) => {
    setFeedbackData(data);
  }

  /**
   * Update modules data.
   * */
  const updateModulesData = (data) => {
    setModulesData(data);
  }

  return (
    <SaveDataContext.Provider value={ {
      activityMetadata,
      modulesData,
      updateExerciseDataByModule,
      saveDataModule,
      saveDataModuleIntoList,
      stateOfActivity,
      updateStateOfActivityActiveSlide,
      feedbackMetadata,
      updateStateOfActivityBySubmission,
      updateStateOfActivity,
      feedbackData,
      updateFeedbackData,
      updateModulesData
    } }>
      { children }
    </SaveDataContext.Provider>
  )

}


export default SaveDataContext;