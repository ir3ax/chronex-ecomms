import { HiMagnifyingGlass } from 'react-icons/hi2';
import { IoAddCircleOutline } from 'react-icons/io5';
import { ModalView } from './add-modal';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getAllFreebies } from '../../../../service/freebies';
import { ModalViewUpdate } from './update-modal';
import { IoMdAdd } from "react-icons/io";
import { ModalViewUpdateQuantity } from './add-quantity-modal';
import { ModalViewDelete } from './delete-modal';
import { ToastContainer } from 'react-toastify';
import { FaMinus } from "react-icons/fa6";
import { ModalViewUpdateQuantityMinus } from './minus-quantity-modal';
import NoImage  from '../../../../assets/utilities/no-image.png'
import { NoData } from '../../../no-data';

export const FreebiesContent = () => {
    const [openView, setOpenView] = useState<boolean>(false);
    const [openViewUpdate, setOpenViewUpdate] = useState<boolean>(false);
    const [openViewUpdateQuantity, setOpenViewUpdateQuantity] = useState<boolean>(false);
    const [openViewUpdateQuantityMinus, setOpenViewUpdateQuantityMinus] = useState<boolean>(false);
    const [openViewDelete, setOpenViewDelete] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('ATOZ');
    const queryClient = useQueryClient();

    const handleCloseView = () => {
        setOpenView(false);
    };

    const handleCloseViewUpdate = () => {
        setOpenViewUpdate(false);
    };

    const handleCloseViewUpdateQuantity = () => {
        setOpenViewUpdateQuantity(false);
    };

    const handleCloseViewUpdateQuantityMinus = () => {
        setOpenViewUpdateQuantityMinus(false);
    };
    
    const handleCloseViewDelete = () => {
        setOpenViewDelete(false);
    };

    const { data: freebiesData } = useQuery(
        ['freebies-data', sortOption, search],
        () => getAllFreebies(sortOption || 'ATOZ', search),
    );
   
    const handleSortSelect = (e: string) => {
        setSortOption(e)
        queryClient.invalidateQueries('freebies-data');
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }


    //Update Freebies Details
    const [freebiesState, setFreebiesState] = useState({
        freebiesId: "",
        freebiesName: "",
        freebiesImg: "",
        freebiesStorePrice: 0,
        freebiesStatus: ""
    });
    
    const handleModalUpdate = (freebiesId: string, freebiesName: string, freebiesImg: string, freebiesStorePrice: number, freebiesStatus: string) => {
        const updatedValues = {
            freebiesId: freebiesId,
            freebiesName: freebiesName,
            freebiesImg: freebiesImg,
            freebiesStorePrice: freebiesStorePrice,
            freebiesStatus: freebiesStatus
        };
    
        setFreebiesState(updatedValues);
    
        setOpenViewUpdate(true);
    }

    //Update Freebies Quantity Add
    const [freebiesStateQuantity, setFreebiesStateQuantity] = useState({
        freebiesId: "",
        freebiesOriginalQuantity: 0,
        freebiesCurrentQuantity: 0
    });

    const handleModalUpdateQuantity = (freebiesId: string, freebiesOriginalQuantity: number, freebiesCurrentQuantity: number) => {
        const updatedValuesQuantity = {
            freebiesId: freebiesId,
            freebiesOriginalQuantity: freebiesOriginalQuantity,
            freebiesCurrentQuantity: freebiesCurrentQuantity
        };
    
        setFreebiesStateQuantity(updatedValuesQuantity);
    
        setOpenViewUpdateQuantity(true);
    }

    //Update Freebies Quantity Minus
    const [freebiesStateQuantityMinus, setFreebiesStateQuantityMinus] = useState({
        freebiesId: "",
        freebiesOriginalQuantity: 0,
        freebiesCurrentQuantity: 0
    });

    const handleModalUpdateQuantityMinus = (freebiesId: string, freebiesOriginalQuantity: number, freebiesCurrentQuantity: number) => {
        const updatedValuesQuantity = {
            freebiesId: freebiesId,
            freebiesOriginalQuantity: freebiesOriginalQuantity,
            freebiesCurrentQuantity: freebiesCurrentQuantity
        };
    
        setFreebiesStateQuantityMinus(updatedValuesQuantity);
    
        setOpenViewUpdateQuantityMinus(true);
    }


     //Delete Freebies
     const [freebiesStateDelete, setFreebiesStateDelete] = useState({
        freebiesId: "",
        freebiesStatus: "",
    });

    const handleModalDelete = (freebiesId: string, freebiesStatus: string) => {
        const deletedValues = {
            freebiesId: freebiesId,
            freebiesStatus: freebiesStatus,
        };
    
        setFreebiesStateDelete(deletedValues);
    
        setOpenViewDelete(true);
    }

    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            <ToastContainer theme='dark' />
            <ModalView isVisible={openView} handleClose={handleCloseView} />
            <ModalViewUpdate isVisible={openViewUpdate} freebiesId={freebiesState.freebiesId} freebiesName={freebiesState.freebiesName} freebiesImg={freebiesState.freebiesImg} freebiesStorePrice={freebiesState.freebiesStorePrice} freebiesStatus={freebiesState.freebiesStatus} handleClose={handleCloseViewUpdate} />
            <ModalViewUpdateQuantity isVisible={openViewUpdateQuantity} handleClose={handleCloseViewUpdateQuantity} freebiesId={freebiesStateQuantity.freebiesId} freebiesOriginalQuantity={freebiesStateQuantity.freebiesOriginalQuantity} freebiesCurrentQuantity={freebiesStateQuantity.freebiesCurrentQuantity} />
            <ModalViewUpdateQuantityMinus isVisible={openViewUpdateQuantityMinus} handleClose={handleCloseViewUpdateQuantityMinus} freebiesId={freebiesStateQuantityMinus.freebiesId} freebiesOriginalQuantity={freebiesStateQuantityMinus.freebiesOriginalQuantity} freebiesCurrentQuantity={freebiesStateQuantityMinus.freebiesCurrentQuantity} />
            <ModalViewDelete isVisible={openViewDelete} handleClose={handleCloseViewDelete} freebiesId={freebiesStateDelete.freebiesId} freebiesStatus={freebiesStateDelete.freebiesStatus} />
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
                            className='flex justify-center items-center gap-2 pl-7 pr-7 h-[40px]  rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                            onClick={() => setOpenView(true)}
                        >
                            <span>Add Freebies</span>
                            <span className='mt-[1px]'>
                                <IoAddCircleOutline className='w-6 h-6' />
                            </span>
                        </button>
                    </div>
                </div>
                <div className='mt-12 flex flex-col w-full min-h-[70dvh] text-[#555758]'>
                    <div className='w-full h-full flex'>
                        <span className='ml-1 flex flex-1 justify-start items-start font-semibold text-xl'>My Freebies</span>
                        <div className='flex justify-end'>
                            <div className='relative h-10 w-48 min-w-[100px]'>
                                <select
                                    className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-[#63B38F] focus:border-2 focus:border-[#63B38F] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    value={sortOption}
                                    onChange={(e) => handleSortSelect(e.target.value)}
                                >
                                    <option value='ATOZ'>A -&gt; Z</option>
                                    <option value='ZTOA'>Z -&gt; A</option>
                                    <option value='PRICE_HIGH_TO_LOW'>Price High to Low</option>
                                    <option value='PRICE_LOW_TO_HIGH'>Price Low to High</option>
                                    <option value='QUANTITY_HIGH_TO_LOW'>Quantity High to Low</option>
                                    <option value='QUANTITY_LOW_TO_HIGH'>Quantity Low to High</option>
                                </select>
                                <label
                                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#63B38F] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-[#63B38F] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#63B38F] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                                >
                                    SORT LIST BY
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 bg-white w-full h-full max-h-[60dvh] min-h-[60dvh] border justify-center items-start flex overflow-auto p-12'>
                        <div className='w-full h-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 gap-12'>
                            {freebiesData?.freebiesData ? (
                                freebiesData?.freebiesData.map((item, index) => (
                                    <div key={index} className='flex flex-col justify-center items-center border bg-white shadow-2xl shadow-gray-400'>
                                        <div className='w-full h-full flex flex-col justify-center items-center'>
                                            <div className='relative w-full flex justify-center items-center bg-[#233857] p-6 rounded-t-md'>
                                            {item.freebiesImg ?
                                                <img className='rounded-md w-32 h-32' src={`data:image/jpeg;base64,${item.freebiesImg}`} alt={item.freebiesName} />
                                                :
                                                <img className='rounded-md w-32 h-32' src={NoImage} alt='Image of no displayed image.' />
                                            } 
                                            <button onClick={() => handleModalUpdateQuantity(item.freebiesId, item.freebiesOriginalQuantity, item.freebiesCurrentQuantity)} className='absolute right-2 top-2 text-gray-300 hover:text-[#70CE98] cursor-pointer'>
                                                <IoMdAdd className='w-8 h-8' />
                                            </button>
                                            <button onClick={() => handleModalUpdateQuantityMinus(item.freebiesId, item.freebiesOriginalQuantity, item.freebiesCurrentQuantity)} className='absolute right-3 top-10 text-gray-300 hover:text-[#70CE98] cursor-pointer'>
                                                <FaMinus className='w-[25px] h-8' />
                                            </button>
                                            </div>
                                            <div className='py-6 w-full flex flex-col justify-start items-start gap-2 p-6 text-[#272727]'>
                                                <span><span className='font-semibold text-[#e68a55]'>Name:</span> {item.freebiesName}</span>
                                                <span>
                                                <span className='font-semibold text-[#e68a55]'>Store Price:</span> 
                                                {item.freebiesStorePrice ? (
                                                    <>₱{item.freebiesStorePrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>
                                                ) : (
                                                    <> Free</>
                                                )}
                                                </span>
                                                <span><span className='font-semibold text-[#e68a55]'>Original Quantity:</span> {item.freebiesOriginalQuantity}</span>
                                                <span><span className='font-semibold text-[#e68a55]'>Current Quantity:</span> {item.freebiesCurrentQuantity}</span>
                                                <span className={`${item.freebiesStatus === 'INC' ? 'text-[#E61923]' : 'text-[#428925]'} font-bold`}><span className='font-semibold text-[#e68a55]'>Freebies Status:</span> {item.freebiesStatus}</span>
                                            </div>
                                            <button onClick={() => handleModalUpdate(item.freebiesId, item.freebiesName, item.freebiesImg, item.freebiesStorePrice, item.freebiesStatus)} className='w-full font-semibold flex justify-center items-center bg-[#0091C3] text-white p-2 cursor-pointer hover:bg-[#4da1bd]'>
                                                UPDATE
                                            </button>
                                            <button onClick={() => handleModalDelete(item.freebiesId, item.freebiesStatus)} className='w-full font-semibold flex justify-center items-center bg-[#F44537] text-white p-2 cursor-pointer hover:bg-[#d45951]'>
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='col-span-4 row-span-8 text-center flex justify-center items-center w-full h-full'>
                                    <NoData />     
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );
};
