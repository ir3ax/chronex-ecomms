// PrivateRoutes.tsx
import { RouteObject } from 'react-router-dom';
import { Dashboard } from '../../pages/dashboard';
import { PrivateContainer } from './container';
import { AdminLogin } from '../../pages/admin-login';

export const PrivateRoutes: RouteObject[] = [
    {
        path: '/',
        element: <PrivateContainer />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path:'/chronex-admin-login',
                element: <AdminLogin />
            }
        ],
    },
];
