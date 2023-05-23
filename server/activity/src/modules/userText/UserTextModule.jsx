import { useEffect } from "react";
import "./_user-text.scss"
import { useRef } from "react";
import { useContext } from "react";
import SaveDataContext from "../../SaveDataContext.jsx";

/**
 * Component of Uživatelský text.
 * */
function UserTextModule({ userText }) {
  if (!userText) return;
  const length = userText.questions.length;
  const userTextRef = useRef(null);
  const userTextareaRef = useRef(null);
  const {
    modulesData,
    updateExerciseDataByModule,
    saveDataModuleIntoList,
    stateOfActivity
  } = useContext(SaveDataContext);
  const dataFetchedRef = useRef(false);

  // When component loaded, load data and save its metadata into context. Initialize module's functions.
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData(modulesData[`submission${ stateOfActivity.submissionView }`]);
    saveDataModuleIntoList(userTextareaRef.current.id, userTextareaRef, saveData);
  }, [userTextRef.current]);

  // When submission view is changed, render module with specific mode.
  useEffect(() => {
      loadData(modulesData[`submission${ stateOfActivity.submissionView }`])
    }, [stateOfActivity.submissionView]
  );

  /**
   * Method to save the data from specific textarea
   *
   * @param {Object} userTextareaRef - A reference to textarea
   *
   * @returns {Object} Returns the object of textarea value with its attributes.
   *
   * */
  const saveData = (userTextareaRef) => {
    if (!userTextareaRef) return;
    const data = {
      id: "",
      entry: "",
      slide: {
        id: "",
        index: 0,
      },
      submission: stateOfActivity.submission
    }
    data.id = userTextareaRef.id;
    data.entry = userTextareaRef.value;
    return { [data.id]: data };
  }

  const resetUserText = () => {
    userTextareaRef.current.value = '';
  }

  /**
   * Method to load the data to specific textarea
   *
   * @param {Object} data - An object with values and attributes
   *
   * */
  const loadData = (data) => {
    resetUserText();
    const userTextId = userTextareaRef.current.id;
    for (const dataKey in data) {
      if (userTextId !== dataKey) continue;
      const text = data[dataKey];
      userTextareaRef.current.value = text.entry;
    }
  }

  // Render each questions from activity metadata
  const renderQuestion = (userText) => {
    return userText.questions.map((question, index) => {
      const instruction = question.instruction
      const rows = question.height || 7
      const duplicatedSource = question.duplicate ? question.duplicate.join(" ") : false;

      return (
        <div className={ `item user-text item-${ length }` }
             key={ index }
             ref={ userTextRef }
        >
          { question.assignments &&
            <h3 className={ `user-text__question` }>
              { question.assignments }
            </h3>
          }
          <div className={ `user-text__textarea` }>
            <textarea className={ `user-text__input` }
                      id={ question.id }
                      placeholder={ instruction }
                      minLength={ question.minLength || 2 }
                      maxLength={ question.maxLength || 1000 }
                      data-duplicate-text={ duplicatedSource }
                      data-save={ "" }
                      data-textarea-target=""
                      rows={ rows }
                      required={ "" }
                      tabIndex={ "-1" }
                      readOnly={ stateOfActivity.viewOnly }
                      ref={ userTextareaRef }
            >
              { question.hodnota }

            </textarea>
          </div>
          <div className={ `user-text__counter` }>
            <span data-usertext-counter={ "" }>0</span>
            <span>&thinsp;/&thinsp;!{ question.maxLength }</span>
          </div>
        </div>
      )
    });
  };

  return (
    <>
      <div className={ `row user-texts` }>
        <div className={ `user-texts-container` }>
          { renderQuestion(userText) }
        </div>

      </div>
    </>
  )
}

export default UserTextModule