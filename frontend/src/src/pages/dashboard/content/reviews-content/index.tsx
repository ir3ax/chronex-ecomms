import { HiMagnifyingGlass } from 'react-icons/hi2';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { ModalViewReviews } from './add-modal-reviews';
import { ModalViewReviewsUpdate } from './update-modal-reviews';
import { getAllReviews } from '../../../../service/reviews';
import { getProductById } from '../../../../service/product-service';
import { formatDate } from '../../../../utility/common';
import { ModalViewReviewsDelete } from './delete-modal-reviews';
import { NoData } from '../../../no-data';
import { BiSolidEdit } from 'react-icons/bi';
import { BsFillTrashFill } from 'react-icons/bs';

export const ReviewsContent = () => {

    const [openView, setOpenView] = useState<boolean>(false);
    const [openViewReviewsUpdate, setOpenViewReviewsUpdate] = useState<boolean>(false);
    const [openViewReviewsDelete, setOpenViewReviewsDelete] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('ATOZ');
    const queryClient = useQueryClient();

    const handleCloseView = () => {
        setOpenView(false);
    };

    const handleCloseViewReviewsUpdate = () => {
        setOpenViewReviewsUpdate(false);
    };

    const handleCloseViewReviewsDelete = () => {
        setOpenViewReviewsDelete(false);
    };

    const { data: reviewsData } = useQuery(
        ['reviews-data', sortOption, search],
        () => getAllReviews(sortOption || 'ATOZ', search),
    );

    const { data: productDataName } = useQuery(
        ['product-data-name'],
        async () => {
            if (!reviewsData || !reviewsData.reviewsData) return [];
            const productPromises = reviewsData.reviewsData.map(item => getProductById(item.productId));
            const productsData = await Promise.all(productPromises);
            return productsData;
        },
        {
            enabled: !!reviewsData && !!reviewsData.reviewsData || !!search, // Ensure the query is enabled when reviewsData is available
        }
    );
    
   
    const handleSortSelect = (e: string) => {
        setSortOption(e)
        queryClient.invalidateQueries('reviews-data');
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    //Update Freebies Details
    const [reviewsUpdateState, setRviewsUpdateState ] = useState({
        reviewsId: "",
        productId: "",
        reviewsName: "",
        reviewsSubject: "",
        reviewsMessage: "",
        reviewsStarRating: 0,
    });
    
    const handleModalUpdate = (reviewsId: string, productId: string, reviewsName: string, reviewsSubject: string, reviewsMessage: string, reviewsStarRating: number) => {
        const updatedValues = {
            reviewsId: reviewsId,
            productId: productId,
            reviewsName: reviewsName,
            reviewsSubject: reviewsSubject,
            reviewsMessage: reviewsMessage,
            reviewsStarRating: reviewsStarRating,
        };
    
        setRviewsUpdateState(updatedValues);
    
        setOpenViewReviewsUpdate(true);
    }

     //Delete Reviews
     const [reviewsStateDelete, setReviewsStateDelete] = useState({
        reviewsId: "",
        reviewsStatus: "",
    });

    const handleModalReviewsDelete = (reviewsId: string, reviewsStatus: string) => {
        const deletedValues = {
            reviewsId: reviewsId,
            reviewsStatus: reviewsStatus,
        };
    
        setReviewsStateDelete(deletedValues);
    
        setOpenViewReviewsDelete(true);
    }


    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            <ToastContainer theme='dark' />
            <ModalViewReviews isVisible={openView} handleClose={handleCloseView} />
            <ModalViewReviewsUpdate isVisible={openViewReviewsUpdate} handleClose={handleCloseViewReviewsUpdate} reviewsId={reviewsUpdateState.reviewsId} productId={reviewsUpdateState.productId} reviewsName={reviewsUpdateState.reviewsName} reviewsSubject={reviewsUpdateState.reviewsSubject} reviewsMessage={reviewsUpdateState.reviewsMessage} reviewsStarRating={reviewsUpdateState.reviewsStarRating} />
            <ModalViewReviewsDelete isVisible={openViewReviewsDelete} handleClose={handleCloseViewReviewsDelete} reviewsId={reviewsStateDelete.reviewsId} reviewsStatus={reviewsStateDelete.reviewsStatus} />
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
                            onClick={() => setOpenView(true)}
                            className='flex justify-center items-center gap-2 pl-8 pr-8 h-[40px]  rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                        >
                            <span>Add Reviews</span>
                            <span className='mt-[1px]'>
                                <IoAddCircleOutline className='w-6 h-6' />
                            </span>
                        </button>
                    </div>
                </div>
                <div className='mt-12 flex flex-col w-full min-h-[70dvh] text-[#555758]'>
                    <div className='w-full h-full flex'>
                        <span className='ml-1 flex flex-1 justify-start items-start font-semibold text-xl'>My Reviews</span>
                        <div className='flex justify-end'>
                            <div className='relative h-10 w-48 min-w-[100px]'>
                                <select
                                    className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-[#63B38F] focus:border-2 focus:border-[#63B38F] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    value={sortOption}
                                    onChange={(e) => handleSortSelect(e.target.value)}
                                >
                                    <option value='ATOZ'>A -&gt; Z</option>
                                    <option value='ZTOA'>Z -&gt; A</option>
                                    <option value='REVIEWS_RATING_HIGH_TO_LOW'>Ratings High to Low</option>
                                    <option value='REVIEWS_RATING_LOW_TO_HIGH'>Ratings Low to High</option>
                                    <option value='REVIEWS_DATE_HIGH_TO_LOW'>Date High to Low</option>
                                    <option value='REVIEWS_DATE_LOW_TO_HIGH'>Date Low to High</option>
                                </select>
                                <label
                                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-r border-gray-600  before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#63B38F] peer-focus:before:border-t-2 peer-focus:before:border-r border-gray-600 -2 peer-focus:before:border-[#63B38F] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#63B38F] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                                >
                                    SORT LIST BY
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 bg-white w-full h-full max-h-[60dvh] min-h-[60dvh] border flex-col justify-start items-start flex overflow-auto'>
                        <div className='w-full overflow-x-auto sm:rounded-lg p-12'>
                            <div className='table-container'>
                            <table className='w-full text-sm text-left rtl:text-right text-gray-400'>
                                <thead className='sticky top-0 z-10 text-xs uppercase bg-gray-700 text-gray-400'>
                                {reviewsData?.reviewsData ? (
                                    <tr className='text-center'>
                                        <th className='px-6 py-3 border-r border-gray-400'></th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            ID
                                        </th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            Product
                                        </th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            Display Name
                                        </th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            Subject
                                        </th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            Message
                                        </th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            Rating
                                        </th>
                                        <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                                            Date
                                        </th>
                                        <th scope='col' className='px-6 py-3'>
                                            Action
                                        </th>
                                    </tr>
                                     ) : (
                                        null
                                    )}
                                </thead>
                                <tbody className='text-center pb-24'>
                                {reviewsData?.reviewsData ? (
                                    reviewsData?.reviewsData.map((item, index) => (
                                    <tr key={index} className='bg-gray-900 even:bg-gray-800 border-b border-gray-700'>
                                        <td className='px-6 py-4 border-r border-gray-600'>
                                            {index+1}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600  font-medium text-white whitespace-nowrap ...'>
                                            {item.reviewsId}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                                            {productDataName ? 
                                                (productDataName.length > 0 ? 
                                                    (productDataName[index]?.productData && productDataName[index].productData.length > 0 ? 
                                                        productDataName[index].productData[0]?.productName : 'Loading...') 
                                                    : 'No product data available') 
                                                : 'Loading...'}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600 whitespace-nowrap ...'>
                                            {item.reviewsName}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                                            {item.reviewsSubject}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                                            {item.reviewsMessage}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                                            {item.reviewsStarRating}
                                        </td>
                                        <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                                            {formatDate(parseInt(item.createdAt))}
                                        </td>
                                        <td className='px-6 py-4 flex justify-center items-center gap-2'>
                                            <button  onClick={() => handleModalUpdate(item.reviewsId, item.productId, item.reviewsName, item.reviewsSubject, item.reviewsMessage, item.reviewsStarRating)} type='button' className='font-medium text-blue-600 dark:text-blue-500 hover:text-blue-400 cursor-pointer mr-4'>
                                                <BiSolidEdit className='w-8 h-7' />
                                            </button>
                                            <button onClick={() => handleModalReviewsDelete(item.reviewsId, item.reviewsStatus)}  className='font-medium text-red-600 dark:text-red-500 hover:text-red-400 cursor-pointer'>
                                                <BsFillTrashFill className='w-6 h-6' />
                                            </button>
                                        </td>
                                    </tr>
                                   ))
                                ) : (
                                    <div className='col-span-6 row-span-10 text-center flex justify-center items-center w-full h-full'>
                                        <NoData /> 
                                    </div>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                </div>
        </div>
    );
};
