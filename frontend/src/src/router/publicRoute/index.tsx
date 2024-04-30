// publicRoutes.tsx
import { RouteObject } from 'react-router-dom';
import { AppLayout } from '../../components/appLayout';
import { ProductDetails } from '../../pages/product-details';
import { Cart } from '../../pages/cart';
import TermsOfService from '../../pages/termsofservice';
import PrivacyPolicy from '../../pages/privacypolicy';
import CheckOut from '../../pages/checkout';
import { Success } from '../../pages/success';
import PublicContainer from './container';

export const PublicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <PublicContainer />,
        children: [
            {
                path: '',
                element: <AppLayout />,
            },
            {
                path: 'product-details/:productId',
                element: <ProductDetails />,
            },
            {
                path: 'cart',
                element: <Cart />,
            },
            {
                path: 'termsofservice',
                element: <TermsOfService />,
            },
            {
                path: 'privacypolicy',
                element: <PrivacyPolicy />,
            },
            {
                path: 'checkout',
                element: <CheckOut />,
            },
            {
                path: 'success',
                element: <Success />,
            },
        ],
    },
];
