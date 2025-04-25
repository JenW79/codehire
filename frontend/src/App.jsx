import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import ManageSpotsPage from './components/ManageSpotsPage/ManageSpotsPage'
import LandingPage from "./components/LandingPage/LandingPage";
import SpotDetailsPage from "./components/SpotDetailsPage/SpotDetailsPage";
import CreateSpotForm from "./components/CreateSpotForm/CreateSpotForm";


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', 
        element: <LandingPage /> 
      },
      { path: '/spots/current', 
        element: <ManageSpotsPage /> },
      { path: "/spots/:spotId", 
        element: <SpotDetailsPage /> },
        {path:"/spots/new",
          element: <CreateSpotForm />},
          {path: "/spots/:spotId/edit",
            element: <CreateSpotForm />},
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
