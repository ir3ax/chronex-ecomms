import { ToastContainer } from 'react-toastify';
import { FcSalesPerformance } from "react-icons/fc";
import { FcPaid } from "react-icons/fc";
import { FcPositiveDynamic } from "react-icons/fc";
import { FcMoneyTransfer } from "react-icons/fc";
import { ModalRevenueView } from './revenue';
import { useState } from 'react';
import { ModalTotalOrderView } from './total-order';
import { ModalBestSellingView } from './best-selling';
import { ModalTotalExpensesView } from './total-expenses';

export const GenerateReportContent = () => {

    const [openViewRevenue, setOpenViewRevenue] = useState<boolean>(false);
    const [openViewTotalOrder, setOpenViewTotalOrder] = useState<boolean>(false);
    const [openViewBestSelling, setOpenViewBestSelling] = useState<boolean>(false);
    const [openViewTotalExpenses, setOpenViewTotalExpenses] = useState<boolean>(false);

    const handleCloseViewRevenue = () => {
        setOpenViewRevenue(false);
    };

    const handleCloseViewTotalOrder = () => {
        setOpenViewTotalOrder(false);
    };

    const handleCloseViewBestSelling = () => {
        setOpenViewBestSelling(false);
    };

    const handleCloseViewTotalExpenses = () => {
        setOpenViewTotalExpenses(false);
    };

    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            <ToastContainer theme='dark' />
            <ModalRevenueView isVisible={openViewRevenue} handleClose={handleCloseViewRevenue} />
            <ModalTotalOrderView isVisible={openViewTotalOrder} handleClose={handleCloseViewTotalOrder} />
            <ModalBestSellingView isVisible={openViewBestSelling} handleClose={handleCloseViewBestSelling} />
            <ModalTotalExpensesView isVisible={openViewTotalExpenses} handleClose={handleCloseViewTotalExpenses} />
                <div className='mt-12 flex flex-col w-full min-h-[70dvh] text-[#cbd1d4]'>
                    <div className='w-full h-full flex'>
                        <span className='ml-1 flex flex-1 justify-start items-start font-semibold text-xl text-[#555758]'>Generate Reports</span>
                    </div>
                    <div className='mt-8 bg-white w-full h-full max-h-[90dvh] min-h-[60dvh] border justify-center items-start flex overflow-auto p-12'>
                        <div className='w-full h-full grid sm:grid-cols-3 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 gap-12'>
                            <button onClick={() => setOpenViewRevenue(true)} type='button' className='gap-4 bg-[#172539] hover:bg-[#38485f] rounded-md cursor-pointer min-h-24 flex justify-center items-center border shadow-sm shadow-gray-400'>
                                <span><FcSalesPerformance className='w-7 h-7' /></span>
                                <span>Generate Revenue</span>
                            </button>
                            <button onClick={() => setOpenViewTotalOrder(true)} type='button' className='gap-4 bg-[#172539] hover:bg-[#38485f] rounded-md cursor-pointer  min-h-24 flex justify-center items-center border shadow-sm shadow-gray-400'>
                                <span><FcPaid className='w-7 h-7' /></span>
                                <span>Generate Total Order</span>
                            </button>
                            <button onClick={() => setOpenViewBestSelling(true)} type='button' className='gap-4 bg-[#172539] hover:bg-[#38485f] rounded-md cursor-pointer  min-h-24 flex justify-center items-center border shadow-sm shadow-gray-400'>
                                <span><FcPositiveDynamic className='w-7 h-7' /></span>
                                <span>Generate Best Selling</span>
                            </button>
                            <button onClick={() => setOpenViewTotalExpenses(true)} type='button' className='gap-4 bg-[#172539] hover:bg-[#38485f] rounded-md cursor-pointer  min-h-24 flex justify-center items-center border shadow-sm shadow-gray-400'>
                                <span><FcMoneyTransfer className='w-7 h-7' /></span>
                                <span>Generate Total Spent</span>
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    );
};
