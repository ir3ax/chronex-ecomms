
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoAddCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { PendingTable } from "./pending-table";
import { ActiveTable } from "./active-order";
import { AddOrderModalView } from "./add-modal";
import { useQueryClient } from "react-query";
import { ShippedTable } from "./shipped-order";
import { DeliveredTable } from "./delivered-order";
import { CancelledTable } from "./cancelled-order";
import { useAtom } from "jotai";
import { activeTabAtom } from "../../../../atom/contentAtom";

export const OrderContent = () => {

    const [addOrderOpenView, setAddOrderOpenView] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useAtom(activeTabAtom);
    
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('ATOZ');
    
    const handleSortSelect = (e: string) => {
        setSortOption(e)
        queryClient.invalidateQueries('product-data');
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleAddOrderCloseView = () => {
        setAddOrderOpenView(false);
    };
   
    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            <ToastContainer theme='dark' />
            <AddOrderModalView isVisible={addOrderOpenView} handleClose={handleAddOrderCloseView} />
                <div className='flex w-full'>
                    <div className='relative w-full flex flex-1 justify-start items-start'>
                        <span className='absolute top-3 left-4'>
                            <HiMagnifyingGlass />
                        </span>
                        <input
                            className='flex w-[80%] h-[40px] rounded-md border border-input bg-background px-12 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63B38F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            type='search' 
                            placeholder='Search'
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className='w-full flex flex-1 justify-end items-end'>
                        <button
                        className='flex justify-center items-center gap-2 pl-10 pr-10 h-[40px]  rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                        onClick={() => setAddOrderOpenView(true)}
                        >
                            <span>Add Order</span>
                            <span className='mt-[1px]'>
                                <IoAddCircleOutline className='w-6 h-6' />
                            </span>
                        </button>
                    </div>
                </div>
                <div className='mt-12 flex flex-col w-full min-h-[70dvh] text-[#555758]'>
                    <div className='w-full h-full flex'>
                        <span className='ml-1 flex flex-1 justify-start items-start font-semibold text-xl'>My Orders</span>
                        <div className='flex justify-end'>
                            <div className="relative h-10 w-48 min-w-[100px]">
                                <select
                                    onChange={(e) => handleSortSelect(e.target.value)}
                                    value={sortOption}
                                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-[#63B38F] focus:border-2 focus:border-[#63B38F] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                                    <option value='ATOZ'>A -&gt; Z</option>
                                    <option value='ZTOA'>Z -&gt; A</option>
                                    <option value='ORDER_DATE_HIGH_TO_LOW'>Newest</option>
                                    <option value='ORDER_DATE_LOW_TO_HIGH'>Oldest</option>
                                </select>
                                <label
                                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#63B38F] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-[#63B38F] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#63B38F] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    SORT LIST BY
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 bg-white w-full h-full min-h-[60dvh] border'>
                        <div className=' bg-white w-full h-full max-h-[60dvh] min-h-[60dvh] justify-center items-start flex overflow-auto p-12'>
                            <div className='w-full h-full'>
                                <div className='w-full flex gap-4 text-sm tracking-wider border-2 p-2'>
                                    <p
                                        className={`w-32 text-[14px] text-gray-400 ${
                                        activeTab === 'pending' ? 'border-[#010953] border-b-[3px]' : 'border-transparent'
                                        } w-16 flex justify-center cursor-pointer`}
                                        onClick={() => setActiveTab('pending')}
                                    >
                                        Processing
                                    </p>
                                    |
                                    <p
                                        className={`w-32 text-[14px] text-gray-400 ${
                                        activeTab === 'active' ? 'border-[#010953] border-b-[3px]' : 'border-transparent'
                                        } w-24 flex justify-center cursor-pointer`}
                                        onClick={() => setActiveTab('active')}
                                    >
                                        Active
                                    </p>
                                    |
                                    <p
                                        className={`w-32 text-[14px] text-gray-400 ${
                                        activeTab === 'shipped' ? 'border-[#010953] border-b-[3px]' : 'border-transparent'
                                        } w-24 flex justify-center cursor-pointer`}
                                        onClick={() => setActiveTab('shipped')}
                                    >
                                        Shipped
                                    </p>
                                    |
                                    <p
                                        className={`w-32 text-[14px] text-gray-400 ${
                                        activeTab === 'delivered' ? 'border-[#010953] border-b-[3px]' : 'border-transparent'
                                        } w-24 flex justify-center cursor-pointer`}
                                        onClick={() => setActiveTab('delivered')}
                                    >
                                        Delivered
                                    </p>
                                    |
                                    <p
                                        className={`w-32 text-[14px] text-gray-400 ${
                                        activeTab === 'cancelled' ? 'border-[#010953] border-b-[3px]' : 'border-transparent'
                                        } w-24 flex justify-center cursor-pointer`}
                                        onClick={() => setActiveTab('cancelled')}
                                    >
                                        Cancelled
                                    </p>
                                </div>
                                <div>{activeTab === 'pending' ? <PendingTable sortOption={sortOption} search={search} /> : null}</div>
                                <div>{activeTab === 'active' ? <ActiveTable sortOption={sortOption} search={search} /> : null}</div>
                                <div>{activeTab === 'shipped' ? <ShippedTable sortOption={sortOption} search={search} /> : null}</div>
                                <div>{activeTab === 'delivered' ? <DeliveredTable sortOption={sortOption} search={search} /> : null}</div>
                                <div>{activeTab === 'cancelled' ? <CancelledTable sortOption={sortOption} search={search} /> : null}</div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}