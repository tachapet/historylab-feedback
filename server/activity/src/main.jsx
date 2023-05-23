import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './scss/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { SaveDataProvider } from "./SaveDataContext.jsx";
import ErrorPage from "./classPage/ErrorPage.jsx";
import ClassPage from "./classPage/ClassPage.jsx";
import IntroPage from "./classPage/IntroPage.jsx";
import StudentPage from "./classPage/StudentPage.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/**
 * Router paths and their components.
 * */
const router = createBrowserRouter([
  {
    path: "/cviceni/:slug",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/cviceni/:slug/:modeOfActivity/:entryId",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/trida/:classSlug",
    element: <ClassPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/zak",
    element: <StudentPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <IntroPage />,
    errorElement: <ErrorPage />,
  },
]);


/**
 * Initial point of App.
 * */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SaveDataProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </SaveDataProvider>
  </React.StrictMode>,
);