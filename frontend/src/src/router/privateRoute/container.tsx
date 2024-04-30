// PrivateContainer.tsx
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

export const PrivateContainer = () => {
    const signInAtomDetailsValue = localStorage.getItem('userAdminDetails'); // Retrieve data directly from localStorage
    const navigate = useNavigate();

    useEffect(() => {
        if (!signInAtomDetailsValue) {
            navigate('/chronex-admin-login');
        }else if(signInAtomDetailsValue){
            navigate('/dashboard')
        }
    }, [signInAtomDetailsValue, navigate]);

    return <Outlet />;
};
