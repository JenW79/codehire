import ProtectedRoute from "./utils/ProtectedRoute";
import LandingOrRedirect from "./utils/LandingOrRedirect";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import * as sessionActions from "./store/session";
import { ModalProvider } from "./context/Modal";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ApplicationsList from "./components/Applications/ApplicationsList";
import SingleApplication from "./components/Applications/SingleApplication";
import ApplicationFormWrapper from "./components/Applications/ApplicationFormWrapper";
import Navigation from "./components/Navigation/Navigation";
import JobSearchPage from "./components/Jobs/JobsSearchPage";



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
    <ModalProvider>
      <Navigation isLoaded={isLoaded} />
      <ToastContainer />
      {isLoaded && <Outlet />}
    </ModalProvider>
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
    ],
  },
]);


// App Component
function App() {
  return <RouterProvider router={router} />;
}

export default App;
