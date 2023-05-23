import { useEffect, useRef, useState, useContext } from 'react'
import SaveDataContext from "../../SaveDataContext.jsx";
import "./_feedback-teacher.scss"
import { Field, useField } from "formik";
import React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import ReactAudioPlayer from "react-audio-player";
import { Button, Col, Row } from "reactstrap";
import TrashCanSvg from "../svgs/TrashCanSvg.jsx";

/**
 * Component of checkbox group in feedback module.
 * */
export const RenderCheckboxGroup = ({ checkbox, formik }) => {
  const {
    stateOfActivity
  } = useContext(SaveDataContext);

  const [field] = useField(checkbox.id);
  //If user is student and feedback data aren't provided, don't render;
  if (stateOfActivity.user === "student" && !formik.values[checkbox.id]) return <></>;

  // Render group of elements specified by array in feedbackMetadata.json.
  return <div key={ checkbox.id } className={ `checkbox-group` }>
    { checkbox.inputs.map(input => {
      if (stateOfActivity.user === "student" && formik.values[checkbox.id] && !formik.values[checkbox.id].some(element => element === input.id)) {
        return;
      }
      let filedChecked = "";
      if (field.value && field.value.some((i) => i === input.id)) {
        filedChecked = "checked"
      }
      return <React.Fragment key={ `${ checkbox.id }-${ input.id }` }>
        <label className={ `option ${ filedChecked }` }>
          <Field type="checkbox" name={ `${ checkbox.id }` }
                 value={ `${ input.id }` }
                 className={ `sq-input` }
                 disabled={ stateOfActivity.feedbackViewOnly }
          />
          { input.name }
        </label>
      </React.Fragment>
    }) }
  </div>
}

/**
 * Component of feedback user text. Simple textarea.
 *
 * */
export const RenderUserText = ({ userText }) => {
  const {
    stateOfActivity
  } = useContext(SaveDataContext);

  const [field] = useField(userText.id);

  return <div className={ `feedback-user-text checkbox-group` }
              key={ userText.id }>
    <Field key={ `files-${ userText.id }` }
           component="textarea"
           label={ `${ userText.id }` }
           name={ `${ userText.id }` }
           placeholder={ `${ userText.placeholder }` }
           rows="4"
           className={ "feedback-textarea " }
           id={ `${ userText.id }` }
           readOnly={ stateOfActivity.feedbackViewOnly }
           value={ field.value || '' }
    />
  </div>
}

/**
 * Component of feedback module in activity. Render side box with elements.
 * Elements are specified in file activities/src/assets/feedbackMetadata.json
 *
 * */
const FeedbackTeacher = ({ formik }) => {

  const {
    feedbackMetadata,
    stateOfActivity
  } = useContext(SaveDataContext);

  // Render group of slides. Each slide has different group of elements, which are change when slide change.
  const renderGroupSlides = () => {
    let slidesFeedback = [];
    for (const feedbackMetadataKey in feedbackMetadata) {
      const feedbackInputs = feedbackMetadata[feedbackMetadataKey];
      if (feedbackMetadataKey === stateOfActivity.currentSlide) {
        for (const feedbackInput of feedbackInputs) {
          // If on selected slide is checkbox group
          if (feedbackInput.type === "checkboxGroup") {
            slidesFeedback.push(<RenderCheckboxGroup
              key={ feedbackInput.id }
              checkbox={ feedbackInput }
              formik={ formik }
            />)
          }
          // If on selected slide is user text
          if (feedbackInput.type === "userText") {
            slidesFeedback.push(<RenderUserText
              key={ feedbackInput.id }
              userText={ feedbackInput }/>)
          }
          // If on selected slide is audio (used library react-audio-voice-recorder and react-audio-player)
          if (feedbackInput.type === "audio") {
            slidesFeedback.push(
              <Row key={ feedbackInput.id } className={ `checkbox-group` }>
                <Col>
                  { !stateOfActivity.feedbackViewOnly && !formik.values[feedbackInput.id] &&
                    <div className={ `row p-0` }>
                      <div className={ `row p-0 mb-2` }>{feedbackInput.placeholderMic}</div>
                      <div className={ `row p-0` }>
                        <Col className={ "d-flex justify-content-center p-0" }>
                          <AudioRecorder
                            onRecordingComplete={ (blob) => addAudioElement(blob, feedbackInput.id) }
                          />
                        </Col>
                      </div>
                    </div> }
                  { formik.values[feedbackInput.id] &&
                    <div className={ `row p-0` }>
                      <div className={ `row p-0 mb-2` }>{feedbackInput.placeholderRecord}</div>
                      <div className={ `row p-0` }>
                        <Col>
                          <ReactAudioPlayer
                            src={ formik.values[feedbackInput.id] }
                            controls
                            style={ { width: "100%" } }
                          />
                        </Col>
                      </div>
                      { stateOfActivity.user === "teacher" && stateOfActivity.feedbackViewOnly === false &&
                        <div className={ `row` }>
                          <Col
                            className={ "d-flex justify-content-center mt-2" }>
                            <Button color={ "light" } tabIndex={ "-1" }
                                    style={ { border: "solid 2px grey" } }
                                    title={ `Smazat nahrávku` }
                                    onClick={ () => formik.setFieldValue(feedbackInput.id, null) }
                                    data-saving={ `ukládám` }><TrashCanSvg/>
                            </Button>
                          </Col>
                        </div>
                      }

                    </div>
                  }
                </Col>
              </Row>
            )
          }
        }
      }
    }
    return slidesFeedback;
  }

  // Method is called when user save audio record. Creating blob, convert to base64 and set formik value. Viz.: https://stackoverflow.com/questions/25046301/convert-url-to-file-or-blob-for-filereader-readasdataurl
  const addAudioElement = (blob, valueId) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      formik.setFieldValue(valueId, base64data)
    }
  };

  // Render box of feedback and go through all elements in feedbackMetadata.json. On the last slide, render save button (if user is teacher and not feedback view only)
  return (
    <div id={ `feedback-teacher` } className={ `feedback-teacher` }>
      <div>Zpětná vazba</div>
      { renderGroupSlides() }
      { stateOfActivity.currentSlide === "slide-export" && !stateOfActivity.feedbackViewOnly &&
        <button className={ `button button-ok` } type={ "submit" }
                data-save-button={ "submit" } tabIndex={ "-1" }
                data-saving={ `ukládám` }>Uložit zpětnou vazbu
        </button> }
    </div>
  )


}

export default FeedbackTeacher