

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
// import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import LandingOrRedirect from "./components/LandingOrRedirect";


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
     
      { path: "/applications", element: <ApplicationsList /> },
      { path: "/applications/new", element: <ApplicationFormWrapper /> },
      { path: "/applications/:applicationId", element: <SingleApplication /> },
      {
        path: "/applications/:applicationId/edit",
        element: <ApplicationFormWrapper />,
      },
      // Add more routes here later like /applications, etc.
    ],
  },
]);

// App Component
function App() {
  return <RouterProvider router={router} />;
}

export default App;
