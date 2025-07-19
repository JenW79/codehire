import ProtectedRoute from "./utils/ProtectedRoute";
import LandingOrRedirect from "./utils/LandingOrRedirect";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import * as sessionActions from "./store/session";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ApplicationsList from "./components/Applications/ApplicationsList";
import SingleApplication from "./components/Applications/SingleApplication";
import ApplicationFormWrapper from "./components/Applications/ApplicationFormWrapper";
import Navigation from "./components/Navigation/Navigation";
import JobSearchPage from "./components/Jobs/JobsSearchPage";
import SavedJobsPage from "./components/Jobs/SavedJobsPage";
import ResumeBuilder from "./components/Resumes/ResumeBuilder";
import { Modal } from "./context/Modal";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreCSRF()).then(() => {
      dispatch(sessionActions.restoreUser()).then(() => {
        setIsLoaded(true);
      });
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <ToastContainer />
      {isLoaded && <Outlet />}
      <Modal />
    </>
  );
}

// Create router
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingOrRedirect />,
      },

      {
        path: "/applications",
        element: (
          <ProtectedRoute>
            <ApplicationsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/applications/new",
        element: (
          <ProtectedRoute>
            <ApplicationFormWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: "/applications/:applicationId",
        element: (
          <ProtectedRoute>
            <SingleApplication />
          </ProtectedRoute>
        ),
      },
      {
        path: "/applications/:applicationId/edit",
        element: (
          <ProtectedRoute>
            <ApplicationFormWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: "/applications/:applicationId/delete",
        element: (
          <ProtectedRoute>
            <ApplicationFormWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobSearchPage />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/jobs/:jobId",
      //   element: (
      //     <ProtectedRoute>
      //       <JobDetailPage />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/saved",
        element: (
          <ProtectedRoute>
            <SavedJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/resumes",
        element: (
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// App Component
function App() {
  return <RouterProvider router={router} />;
}

export default App;
