import { createRoot } from 'react-dom/client'
import './preprocessor/Main.sass'
import App from './App.tsx'
import ManagerPanel from './ManagerPanel.tsx';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from 'react-router';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <App/>
        ),
    },
    {
        path: '/manager_panel',
        element: (
            <ManagerPanel/>
        ),
    },
]);



createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
