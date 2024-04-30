import { IoAddCircleOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
// import { NoData } from '../../../no-data';
import { useState } from 'react';
import { AddModalView } from './add-modal';
import { useQuery } from 'react-query';
import { getAllHomeImages } from '../../../../service/home-images';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { NoData } from '../../../no-data';
import { BiSolidEdit } from 'react-icons/bi';
import { BsFillTrashFill } from 'react-icons/bs';
import { UpdateModalView } from './update-modal';
import { DeleteModalView } from './delete-modal';

export const HomeImagesContent = () => {

    const [openView, setOpenView] = useState<boolean>(false);

    const handleCloseView = () => {
        setOpenView(false);
    };

    const { data: homeImagesData } = useQuery(
        ['home-images-data'],
        () => getAllHomeImages(),
    );
        
    const divStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    //Update Home Images Details
    const [openViewUpdate, setOpenViewUpdate ] = useState<boolean>(false);

    const handleCloseViewUpdate = () => {
        setOpenViewUpdate(false);
    };

    const [homeImagesUpdateState, setHomeImagesUpdateState] = useState({
        homeImagesId: "",
        homeImg: "",
    });
    
    const handleModalHomeImagesUpdate = (homeImagesId:string, homeImg:string) => {
        const updatedValues = {
            homeImagesId: homeImagesId,
            homeImg: homeImg,
        };
    
        setHomeImagesUpdateState(updatedValues);
    
        setOpenViewUpdate(true);
    }

    //Delete Home Images Details
    const [openViewDelete, setOpenViewDelete ] = useState<boolean>(false);

    const handleCloseViewDelete = () => {
        setOpenViewDelete(false);
    };

    const [homeImagesDeleteState, setHomeImagesDeleteState] = useState({
        homeImagesId: "",
    });
    
    const handleModalHomeImagesDelete = (homeImagesId:string) => {
        const updatedValues = {
            homeImagesId: homeImagesId,
        };
    
        setHomeImagesDeleteState(updatedValues);
    
        setOpenViewDelete(true);
    }

    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            <ToastContainer theme='dark' />
            <AddModalView isVisible={openView} handleClose={handleCloseView} />
            <UpdateModalView homeImagesId={homeImagesUpdateState.homeImagesId} homeImg={homeImagesUpdateState.homeImg} isVisible={openViewUpdate} handleClose={handleCloseViewUpdate} />
            <DeleteModalView homeImagesId={homeImagesDeleteState.homeImagesId} isVisible={openViewDelete} handleClose={handleCloseViewDelete} />
                <div className='flex w-full'>
                    <div className='w-full flex-1 flex justify-start items-center gap-2 h-[40px]'>
                        <span className='ml-1 font-semibold text-xl'>Home Images</span>
                    </div>
                    {
                        !homeImagesData?.homeImagesData || homeImagesData.homeImagesData.length === 0 ?
                        <div className='w-full flex flex-1 justify-end items-end'>
                            <button
                                className='flex justify-center items-center gap-2 pl-7 pr-7 h-[40px]  rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                                onClick={() => setOpenView(true)}
                            >
                                <span>Add Home Images</span>
                                <span className='mt-[1px]'>
                                    <IoAddCircleOutline className='w-6 h-6' />
                                </span>
                            </button>
                        </div>
                        :
                        <div className='w-full flex flex-1 justify-end items-end gap-2'>
                           <button
                                className='flex justify-center items-center gap-2 pl-4 pr-4 h-[40px] rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                                    onClick={() => {
                                        if (homeImagesData && Array.isArray(homeImagesData.homeImagesData)) {
                                            const firstImageData = homeImagesData.homeImagesData[0];
                                            handleModalHomeImagesUpdate(firstImageData.homeImagesId, firstImageData.homeImg);
                                        }
                                    }}
                                >
                                <span>Update Home Images</span>
                                <span className='mt-[1px]'>
                                    <BiSolidEdit className='w-6 h-6' />
                                </span>
                            </button>
                            <button
                                className='flex justify-center items-center gap-2 pl-4 pr-4 h-[40px] rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                                   onClick={() => {
                                        if (homeImagesData && Array.isArray(homeImagesData.homeImagesData)) {
                                            const firstImageData = homeImagesData.homeImagesData[0];
                                            handleModalHomeImagesDelete(firstImageData.homeImagesId);
                                        }
                                    }}
                                >
                                <span>Delete Home Images</span>
                                <span className='mt-[1px]'>
                                    <BsFillTrashFill className='w-5 h-5' />
                                </span>
                            </button>
                        </div>
                    }
                </div>
                <div className='mt-12 flex flex-col w-full min-h-[70dvh] text-[#555758]'>
                    <div className='mt-8 bg-white w-full h-full max-h-[60dvh] min-h-[60dvh] border justify-center items-start flex overflow-auto p-12'>
                        <div className='slide-container w-full h-full'>
                        {(!homeImagesData?.homeImagesData || homeImagesData.homeImagesData.length === 0) ? <NoData /> : 
                        <>
                        {homeImagesData?.homeImagesData && homeImagesData?.homeImagesData.map((slideImage) => (
                                <Slide>
                                    {slideImage.homeImg.replace(/\\/g, '').replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(',').map((url, urlIndex) => (
                                    <div className='w-full flex justify-center items-center'>
                                        <div key={urlIndex} className='w-[90%] 2xl:h-[450px] xl:h-[350px] lg:h-[350px] max-sm:h-[300px]' style={{ ...divStyle, 'backgroundImage': `url(${url})` }}></div>
                                    </div>
                                ))}
                                </Slide>
                        ))} 
                        </>
                        }
                        </div>
                    </div>
                </div>
        </div>
    );
};
