/**
 * End points of the server application.
 *
 * Activity means exercise (cvičení).
 * */
// Used library: store.js
const store = require('store');

module.exports = app => {

  /**
   * Get new activity by slug.
   * */
  app.get("/api/get-activity/:slug/", (req, res) => {

    const { slug } = req.params;

    const newActivityMetaData = {
      stateOfActivity: {
        viewOnly: false,
        user: "student",
        submissionView: 1,
        submission: 1,
        feedbackViewOnly: true,
      },
      modulesData: {},
      feedbackData: {}
    }
    res.status(200).send(newActivityMetaData);
  });

  /**
   * Get completed activity with data for first feedback
   *
   * params: entryId - id of completed activity
   *
   * */
  app.get("/api/get-activity/:slug/zpetna-vazba/:entryId", (req, res) => {

    const { slug, entryId } = req.params;
    if (!entryId) res.status(400).send("Nelze dát zpětnou vazbu cvičení bez entryId.");
    const submissionByEntryId = store.get('devata').find(submission => submission.entryId === entryId);
    let modulesData = { submission1: submissionByEntryId.modulesData };
    let feedbackData = { submission1: {} };

    // Setup state of activity
    const stateOfActivity = {
      viewOnly: true,
      user: "teacher",
      submissionView: submissionByEntryId.submission,
      submission: submissionByEntryId.submission,
      feedbackViewOnly: false,
    }

    // Connecting multiple version of submission
    if (submissionByEntryId.parentSubmissionEntryId) {
      const submissionParentByEntryId = store.get('devata').find(submission => submission.entryId === submissionByEntryId.parentSubmissionEntryId);
      modulesData.submission1 = submissionParentByEntryId.modulesData;
      modulesData.submission2 = submissionByEntryId.modulesData;
      feedbackData = {
        submission1: submissionParentByEntryId.feedbackData,
        submission2: {}
      }
    }


    const newActivityMetaData = {
      stateOfActivity,
      modulesData,
      feedbackData
    }

    res.status(200).send(newActivityMetaData);
  });

  /**
   * Get activity, student can edit.
   *
   * params: parentSubmissionEntryId - id of the first submission
   *
   * */
  app.get("/api/get-activity/:slug/uprava/:parentSubmissionEntryId", (req, res) => {

    const { slug, parentSubmissionEntryId } = req.params;
    if (!parentSubmissionEntryId) res.status(404).send({ message: "Nelze upravit cvičení bez entryId rodiče." });

    const submissionParentByEntryId = store.get('devata').find(submission => submission.entryId === parentSubmissionEntryId);
    let modulesData = { submission1: submissionParentByEntryId.modulesData };
    let feedbackData = { submission1: submissionParentByEntryId.feedbackData };

    // Setup state of application
    const newActivityMetaData = {
      stateOfActivity: {
        viewOnly: false,
        user: "student",
        submissionView: 1,
        submission: 2,
        feedbackViewOnly: true,
      },
      modulesData,
      feedbackData
    }
    res.status(200).send(newActivityMetaData);
  });

  /**
   * Get activity, only view.
   *
   * */
  app.get("/api/get-activity/:slug/prohlizeni/:entryId", (req, res) => {

    const { slug, entryId } = req.params;

    const submissionByEntryId = store.get('devata').find(submission => submission.entryId === entryId);
    let modulesData = { submission1: submissionByEntryId.modulesData };
    let feedbackData = { submission1: submissionByEntryId.feedbackData };

    // Connect submissions data.
    if (submissionByEntryId.parentSubmissionEntryId) {
      const submissionParentByEntryId = store.get('devata').find(submission => submission.entryId === submissionByEntryId.parentSubmissionEntryId);
      modulesData.submission1 = submissionParentByEntryId.modulesData;
      modulesData.submission2 = submissionByEntryId.modulesData;
      feedbackData = {
        submission1: submissionParentByEntryId.feedbackData,
        submission2: submissionByEntryId.feedbackData
      }
    }

    // Setup state of activity
    const newActivityMetaData = {
      stateOfActivity: {
        viewOnly: true,
        user: "student",
        submissionView: submissionByEntryId.submission,
        submission: submissionByEntryId.submission,
        feedbackViewOnly: true
      }
      ,
      modulesData,
      feedbackData
    }
    res.status(200).send(newActivityMetaData);
  });


  /**
   * Save activity, one api to handle multiple states.
   *
   * */
  app.post("/api/save-activity/", (req, res) => {

    // If activity was in edit mode.
    if (req.body.parentSubmissionEntryId && !req.body.entryId) {
      const submissions = store.get('devata');
      const submissionsParentWithEntryId = store.get('devata').find(submission => submission.entryId === req.body.parentSubmissionEntryId);
      const submission = {
        submission: 2,
        modulesData: req.body.modulesData,
        studentName: submissionsParentWithEntryId.studentName,
        entryId: ("00000" + store.get('entryIds').length).slice(-6),
        parentSubmissionEntryId: submissionsParentWithEntryId.entryId,
        feedbackData: null,
        timeSpent: Math.floor(Math.random() * 15) + 1
      }
      store.set('entryIds', [...store.get('entryIds'), submission.entryId]);
      store.set('devata', [...submissions, submission]);
      return res.status(200).send({ message: `Druhá verze cvičení je uložena. EntryId: ${ submission.entryId }` });
    }

    // If activity was new.
    if (!req.body.entryId) {
      const submissions = store.get('devata');
      const submissionsWithEntryIdIndex = store.get('devata').findIndex(submission => submission.studentName === req.body.studentName);
      const submission = {
        submission: 1,
        modulesData: req.body.modulesData,
        studentName: req.body.studentName,
        entryId: ("00000" + store.get('entryIds').length).slice(-6),
        parentSubmissionEntryId: null,
        feedbackData: null,
        timeSpent: Math.floor(Math.random() * 15) + 1
      }

      store.set('entryIds', [...store.get('entryIds'), submission.entryId]);
      submissions[submissionsWithEntryIdIndex] = submission;

      store.set('devata', submissions);
      return res.status(200).send({ message: `První verze cvičení je uložena. EntryId: ${ submission.entryId }` });
    }

    // If activity was edited (feedback was given).
    const submissionByClass = store.get('devata');
    const submissionsWithEntryIdIndex = store.get('devata').findIndex(submission => submission.entryId === req.body.entryId);
    if (submissionsWithEntryIdIndex < 0) return res.status(400).send(`cant update ${ req.body.entryId }`);

    const updatedSubmission = { ...submissionByClass[submissionsWithEntryIdIndex] }
    updatedSubmission.modulesData = req.body.modulesData || submissionByClass[submissionsWithEntryIdIndex].modulesData;
    updatedSubmission.feedbackData = req.body.feedbackData || submissionByClass[submissionsWithEntryIdIndex].feedbackData;

    submissionByClass[submissionsWithEntryIdIndex] = updatedSubmission;
    store.set('devata', submissionByClass);
    return res.status(200).send({ message: "Cvičení je aktualizované." });
  });

  /**
   * Get all items in store of class devata.
   * */
  app.get("/api/get-store/", (req, res) => {
    return res.status(200).send(store.get('devata'));
  });

  /**
   * Rollback class to initial state.
   *
   * */
  app.get("/api/reset-class/:classSlug", (req, res) => {
    const { classSlug } = req.params;
    store.set('entryIds', []);
    return res.status(200).send(store.set(classSlug, [{
      studentName: "Petr Novák"
    }, {
      studentName: "Pavel Svoboda"
    }, {
      studentName: "Jitka Černá"
    }]));
  });

  /**
   * Get class metadata
   *
   * */
  app.get("/api/get-class/:classSlug", (req, res) => {
    const { classSlug } = req.params;
    const classData = store.get(classSlug);
    if (!classData) {
      store.set('entryIds', []);
      store.set(classSlug, [{
        studentName: "Petr Novák"
      }, {
        studentName: "Pavel Svoboda"
      }, {
        studentName: "Jitka Černá"
      }])
    }

    let groupSubmissionByStudent = classData.reduce((x, y) => {
      (x[y.studentName] = x[y.studentName] || []).push(y);
      return x;
    }, {});

    // Connecting submissions of each student.
    const response = [];
    Object.keys(groupSubmissionByStudent).forEach((key, index) => {
      const student = groupSubmissionByStudent[key];
      response.push(
        {
          studentName: student[0].studentName,
          submission1: student[0].entryId && {
            entryId: student[0].entryId,
            timeSpent: student[0].timeSpent,
            feedbackAdded: !!student[0].feedbackData
          } || null,
          submission2: student[1] && student[1].entryId && {
            entryId: student[1].entryId || null,
            timeSpent: student[1].timeSpent,
            feedbackAdded: !!student[1].feedbackData
          } || null,

        }
      )
    });
    return res.status(200).send(response);
  });

  /**
   * Student view page with buttons of his submissions or feedbacks.
   * */
  app.get("/api/get-student-data", (req, res) => {
    const submissions = store.get("devata");
    const studentName = req.query.studentName
    const studentSubmission = submissions.filter(submission => submission.studentName === studentName)
    const response = [];
    if (!studentSubmission[0].entryId) {
      response.push({
        label: "Učitel Vám zadal nové cvičení",
        url: `/cviceni/zpetna-vazba-test?student=${ studentName }`,
        type: 0,
        view: false,
      });
      return res.status(200).send(response);
    }
    if (studentSubmission[0].entryId) {
      response.push({
        label: "Zde si můžete zobrazit Vaše vyplněné cvičení.",
        url: `/cviceni/zpetna-vazba-test/prohlizeni/${ studentSubmission[0].entryId }`,
        type: 1,
        view: true,
      });
    }
    if (studentSubmission[0].entryId && studentSubmission[0].feedbackData && !studentSubmission[1] && (JSON.stringify(studentSubmission[0].feedbackData) !== "{}")) {
      response.push({
        label: "Učitel Vám dal zpětnou vazbu. Cvičení můžete upravit zde.",
        url: `/cviceni/zpetna-vazba-test/uprava/${ studentSubmission[0].entryId }`,
        type: 0,
        view: false,
      });
    }

    if (studentSubmission[1] && studentSubmission[1].entryId && (JSON.stringify(studentSubmission[1].feedbackData) === "{}")) {
      response.push({
        label: "Druhé cvičení si můžete prohlédnout zde.",
        url: `/cviceni/zpetna-vazba-test/prohlizeni/${ studentSubmission[1].entryId }`,
        type: 1,
        view: true,
      });
    }

    if (studentSubmission[1] && studentSubmission[1].entryId && (JSON.stringify(studentSubmission[1].feedbackData) !== "{}")) {
      response.push({
        label: "Zpětnou vazbu ke druhému cvičení si můžete prohlédnout zde.",
        url: `/cviceni/zpetna-vazba-test/prohlizeni/${ studentSubmission[1].entryId }`,
        type: 1,
        view: true,
      });
    }

    return res.status(200).send(response);

  });

};