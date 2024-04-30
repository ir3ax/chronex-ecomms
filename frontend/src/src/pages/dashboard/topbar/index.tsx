import { useNavigate } from "react-router-dom";
import { currentUserAdminDetailsAtom } from "../../../atom/adminLoginAtom";

import { CiLogout } from "react-icons/ci"
import { useAtom } from "jotai";

export const DashboardTopBar = () => {

    const [, setSignInAtomDetailsValue] = useAtom(currentUserAdminDetailsAtom);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userAdminDetails');
        localStorage.removeItem('userAdminEmail');
        setSignInAtomDetailsValue('');
        navigate('/chronex-admin-login')
      }
    
    return (
        <nav className='w-full h-full top-0 z-10 pt-6 pb-6 pl-12 pr-12'>
            <div className='flex justify-center items-center'>
                <div className='w-full flex flex-1 justify-start items-start text-[#E0E3FE] font-bold text-md'>
                    Chronex
                </div>
                {/* <button className='w-full flex flex-1 justify-end items-end cursor-pointer'>
                    <FaGear className='w-6 h-6 text-gray-300 hover:text-gray-500 focus:text-gray-500 active:text-gray-500' />
                </button> */}
                <button
                    onClick={handleLogout}
                    className={`w-[8%] gap-1 flex justify-end items-end cursor-pointer text-gray-300 hover:text-gray-500 focus:text-gray-500 active:text-gray-500 hover:underline focus:underline active:underline`}
                >
                    <CiLogout className='w-6 h-6' />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    )
}