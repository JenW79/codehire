// import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Navigation from './components/Navigation/Navigation';
// import * as sessionActions from './store/session';
// import LandingPage from "./components/LandingPage/LandingPage";



// function Layout() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     dispatch(sessionActions.restoreCSRF()).then(() => {
//       dispatch(sessionActions.restoreUser()).then(() => {
//         setIsLoaded(true);
//       });
//     });
//   }, [dispatch]);

//   return (
//     <>
//       <Navigation isLoaded={isLoaded} />
//       {isLoaded && <Outlet />}
//     </>
//   );
// }

// const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       { path: '/', 
//         element: <LandingPage /> 
//       },
      
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import LandingPage from "./components/LandingPage/LandingPage";
import { ModalProvider } from './context/Modal'; // <<< ADDED THIS

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
    <ModalProvider> {/* <<< WRAP everything inside ModalProvider */}
      <Navigation isLoaded={isLoaded} />
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
        path: '/',
        element: <LandingPage />,
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
