import { createRoot } from 'react-dom/client'
import './index.sass'
import App from './App.tsx'
import InfoApp from './InfoApp.tsx';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router';


const router = createBrowserRouter([
  {
      path: '/:id',
      element: (
          <App/>
      ),
  },
  {
    path: 'getInfo/:id',
    element: (
        <InfoApp/>
    ),
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
