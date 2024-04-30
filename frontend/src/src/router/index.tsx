// router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoutes } from './privateRoute';
import { PublicRoutes } from './publicRoute';

export const router = createBrowserRouter([...PublicRoutes, ...PrivateRoutes]);
