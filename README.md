# HistoryLab feedback prototype #

This is functional prototype of diploma thesis **Optimization of an
evaluation process in HistoryLab
application** by student **Petr Tácha**.

The application demonstrate new module of feedback in application HistoryLab.cz.

**I WOULD LIKE TO MENTION THAT THIS IS ONLY HIGH-LEVEL PROTOTYPE, NOT FINAL APPLICATION.**

So I will not describe all its methods, because it isn't aim of this thesis.

If you have problems with project setup or start, contact me: [tachapet@fel.cvut.cz](mailto:tachapet@fel.cvut.cz)


# Activity #
Activity means one exercise, in my case I chose simple exercise Proměny obce Horní Vysoké
(https://www.historylab.cz/cviceni/promeny-obce-horni-vysoke?lang=cs) which I modify and remove hard elements, which would be not necessary for prototype and hard to code.

## Original application HistoryLab - cvičení ##

HistoryLab application for creating activities is under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
I used layout and functions from the solution to make prototype of activity which contain feedback module. 
The repository is located here: https://bitbucket.org/historylab/cviceni/src/master/
The authors are: Maha J., Ferenc J. , Tácha P., Smítka V., Váňa M.

## Content ##
The project is divided into server side and client side.

### Server ###
Server is running on engine Node.js and uses library Express.js.
It contains basic server configuration (`index.js`)
and endpoints for application (`api.js`).

### Client (frontend) ###
Client side is written in framework Vite.js and React.js.
It uses various libraries described below.

Some code is copied from origin application HistoryLab. 
Each file in system is commented. If the docs contains phrase `Origin application` it means
the code is copied from original application HistoryLab and I didn't change it or change only parts which I use in prototype.

Now I briefly describe file system of frontend:

* **src/assets** - Contain setup jsons for application and pictures. `feedbackMetadata.json` contain elements of feedback module. `promeny-obce-horni-vysoke.json` contain template of activity.
* **src/classPage** - Contains basic components for class and student administration. It is only for faster flow of testing.
* **src/js** - Contains JavaScript functions from origin application.
* **src/layout** - Contains components and JavaScript functions, which was refactored from origin application. It serves for activity layout and navigation.
* **src/layout/feedback-teacher** - Contains components and JavaScript functions of newly added module for teacher feedback.
* **src/modules** - Contains components and JavaScript functions of modules from origin application. I only code module SVG, Sources (Prameny) and userText (uživatelskýText), because these modules are used the most. 
* **src/modules/svg** - Module SVG uses library d3.js and additional functions in directory `svg/svg-lib`. These functions are from origin application, except for functions `loadCircle` and `loadPath` in file `svg-draw.js` which are written by me.
* **src/scss** - SCSS files of activity, all of them are from origin application.
* **src/App.jsx** - Main Component for prototype activity. 
* **src/DataService.js** - Application's requests.
* **src/main.js** - Root of React.js application.
* * **src/SaveDataContext.jsx** - Context of application. Contains all metadata of app, state of application and functions to manipulate data in whole application.

## Build and start prototype ##
The prototype is not in final state, so the startup is a bit complicated.
### Necessary programs: ###
* Node.js
* npm

### Dev start ###
* In directory **server** type command `npm i` and then `npm run server-dev`.

* In directory **activities** type command `npm i` and then `npm run app-dev`.

The application should run on localhost on port 3000. Link: [here](http://localhost:3000/)

### Public build and start ###



## Libraries ##

Server:
* cors
* express
* nodemon
* store

App:
* vite
* bootstrap
* d3
* formik
* react
* react-audio-player
* react-audio-voice-recorder
* react-dom
* react-router-dom
* react-toastify
* reactstrap
* sass

And more from origin application.