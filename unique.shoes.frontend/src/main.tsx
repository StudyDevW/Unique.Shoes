import { createRoot } from 'react-dom/client'
import './preprocessor/Main.sass'
import App from './App.tsx'
import ManagerPanel from './ManagerPanel/ManagerPanel.tsx';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from 'react-router';
import PaymentExist from './PaymentExist.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <App/>
        ),
    },
    {
        path: '/paymentexist',
        element: (
            <PaymentExist/>
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
