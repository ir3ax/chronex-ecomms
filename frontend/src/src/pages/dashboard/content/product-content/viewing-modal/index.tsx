import StarRatings from 'react-star-ratings';
import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getFreebiesById } from '../../../../../service/freebies';
import NoImage  from '../../../../../assets/utilities/no-image.png'

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    img: string;
    productName: string;
    discount: number;
    originalPrice: number,
    discountedPrice: number,
    originalQuantity: number,
    currentQuantity: number,
    productSold: number,
    productFreebies: string,
    description1: string,
    description2: string
}

export const ViewingModal = (props: Xprox) => {

    const [ stateQuantity, setStateQuantity ] = useState<number>(1);
    const [, setSelectedFreebie] = useState<string | null>(null);
    const [productFreebiesValue, setProductFreebiesValue] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const { data: freebiesDataViewing } = useQuery(
        ['freebies-data-viewing', productFreebiesValue],
        async () => {
            const freebiesData = await Promise.all(productFreebiesValue.map(getFreebiesById));
            return freebiesData;
        },
    );

    useEffect(() => {
        if (props.productFreebies) {
            const extractedValue = props.productFreebies
                .replace(/\\/g, '')
                .replace(/"/g, '')
                .replace(/\[/g, '')
                .replace(/\]/g, '')
                .trim();
    
            const idsArray = extractedValue.split(',');
    
            setProductFreebiesValue(idsArray);
        }
    }, [props.productFreebies]);

    // Calculate the percentage completion
    const percentageCompletion = (
    (props?.currentQuantity ?? 0) / 
    (props?.originalQuantity ?? 0)
    ) * 100;
        

    // Set the width dynamically based on the percentage completion
    const progressBarStyle = {
    width: `${percentageCompletion}%`,
    };

    const onAdd = () => {
        setStateQuantity(stateQuantity + 1);
    }

    const onMinus = () => {
        setStateQuantity(stateQuantity - 1);
    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageSwap = (index: number) => {
        const imgArray = props.img ? props.img.split(',') : [];
        if (index < imgArray.length) {
            setCurrentImageIndex(index);
        }
    };    

    // Assuming freebiesDataViewing is of type FreebiesDataViewing | undefined
    useEffect(() => {
        if (freebiesDataViewing && Array.isArray(freebiesDataViewing) && freebiesDataViewing.length > 0) {
            const firstFreebieData = freebiesDataViewing[0].freebiesData;
            if (Array.isArray(firstFreebieData) && firstFreebieData.length > 0) {
                setSelectedFreebie(firstFreebieData[0].freebiesName);
            }
        }
    }, [freebiesDataViewing, setSelectedFreebie]);

    const handleCloseViewingModal = () => {
        queryClient.invalidateQueries('freebies-data-viewing');
        setCurrentImageIndex(0);
        setStateQuantity(1);
        props.handleClose();
    }

    return (
        <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start 2xl:w-[90rem] xl:w-[76rem] lg:w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
                <button onClick={handleCloseViewingModal} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-6 h-6 text-[#808080] cursor-pointer' />
                </button>
                <div className='mt-6 w-full h-[200dvh] border-2 pb-12'>
                <div className='mt-12 bg-white relative pb-12'>
                    <div className='flex justify-center items-center gap-8 max-sm:flex-col'>
                    {props.img ? (
                            <div className='flex flex-1 justify-end items-end gap-4 max-sm:flex-col-reverse max-sm:mr-12 max-sm:ml-12 max-sm:justify-center max-sm:items-center'>  
                                <div className='flex flex-col flex-1 justify-end items-end gap-4 w-full h-[80dvh] max-sm:flex-row mb-32'>
                                    {props.img && (
                                        props.img
                                            .replace(/\\/g, '')
                                            .replace(/"/g, '')
                                            .replace(/\[/g, '')
                                            .replace(/\]/g, '')
                                            .split(',')
                                            .map((imageUrl: string, index: number) => (
                                                <button
                                                    key={index}
                                                    className={`max-sm:w-28 max-sm:h-28 flex justify-center items-center w-32 h-32 border rounded-md p-2 hover:border-[#1796CC] active:border-[#1796CC] focus:active:border-[#1796CC] ${index >= (props.currentQuantity || 0) ? 'hidden' : ''}`}
                                                    onClick={() => handleImageSwap(index)}
                                                >
                                                    <img className='w-24 h-24 max-sm:w-20 max-sm:h-20' src={imageUrl} alt={props.productName} />
                                                </button>
                                            ))
                                    )}
                                </div>
                                {props.img && (
                                    <div className='flex flex-1 justify-center items-center w-[70%] h-[70dvh] p-12 border rounded-md max-sm:p-6 mb-32'>
                                    <img
                                        className=''
                                        src={props.img
                                            .replace(/\\/g, '') 
                                            .replace(/"/g, '')  
                                            .replace(/\[/g, '') 
                                            .replace(/\]/g, '') 
                                            .split(',')[currentImageIndex]     
                                        }
                                        alt={props.productName}
                                    />
                                    </div>
                                )} 
                            </div>
                        ) : (
                            <div>No Image Available</div>
                        )}
                        <div className='flex flex-1 justify-start items-start max-sm:justify-center max-sm:items-center'>
                            <div className='flex flex-col justify-start items-start w-full h-[80dvh] max-h-[85dvh] overflow-y-auto'>
                                <div className='w-full max-w-[90%] flex gap-4 max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:text-center max-sm:max-w-[100%]'>
                                    <h1 className='font-normal text-2xl pt-2 max-sm:text-lg lg:text-lg line-clamp-2'>{props?.productName}</h1>
                                    <p className='2xl:w-[20%] xl:w-[20%] w-[20%] lg:w-[30%] max-sm:w-[40%] flex justify-center items-center text-2xl bg-[#cebebe] pl-4 pr-4 pt-2 pb-2 rounded-md font-medium max-sm:text-lg lg:text-lg lg:pl-2 lg:pr-2'>{props?.discount}% OFF</p>
                                </div>
                                <span className='h-[2px] w-[80%] bg-slate-700 mt-4 border-b border-slate-700 max-sm:w-[100%] lg:w-[90%]' />
                                <div className='flex justify-center items-center w-full mt-12 text-2xl max-sm:mt-6 lg:mt-6'>
                                    <p className='flex flex-1 justify-start items-start text-[#A1133A] font-semibold line-through max-sm:justify-center lg:text-lg'>₱{props?.originalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                    <p className='flex flex-1 justify-start items-start text-[#F36000] font-semibold max-sm:justify-center lg:text-lg'>₱{props?.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>
                                <div className='max-sm:hidden mt-6 w-[60%] flex flex-col justify-start items-start gap-2 max-sm:w-[100%] max-sm:pl-12 max-sm:pr-12 max-sm:justify-center max-sm:items-center'>
                                    <span className='text-xl font-normal tracking-wide'>ONLY <span className='text-[#DB1461]'>{props?.currentQuantity === 0 ? 0 : props?.currentQuantity}</span> LEFT</span>
                                    <div className='w-full bg-gray-200 rounded-sm h-3 dark:bg-gray-400'>
                                        <div className='bg-[#615656] h-3 rounded-sm' style={progressBarStyle} />
                                    </div>
                                    <div className='flex justify-start items-start w-full h-full gap-2'>
                                        <StarRatings
                                            rating={4.6}
                                            starRatedColor="#FCD53F"
                                            numberOfStars={1}
                                            name='rating'
                                            starDimension='16px'
                                        />
                                        <div className='text-gray-400 text-sm mt-1'>{4.6} ratings |</div>
                                        <div className='text-gray-400 text-sm mt-1'>{props?.productSold} sold</div>
                                    </div>
                                </div>
                                <div className='max-sm:hidden flex justify-center items-center w-full mt-8 lg:gap-4 mb-6'>
                                    <div className='flex justify-start items-start gap-1 w-[20%] max-sm:justify-center max-sm:w-[70%]'>
                                        <button disabled={stateQuantity === 1} onClick={onMinus} className={`${stateQuantity === 1 ? 'opacity-50' : 'opacity-100'} w-16 h-12 rounded-sm border bg-[#615656] max-sm:w-10 max-sm:h-10`}>
                                            <span className='text-3xl text-white lg:text-lg'>-</span>
                                        </button>
                                        <input value={stateQuantity} className='w-8 h-12 border-t border-b text-center max-sm:w-8 max-sm:h-10' />
                                        <button disabled={stateQuantity >= (props?.currentQuantity ?? 0)} onClick={onAdd} className={`${stateQuantity >= (props?.currentQuantity ?? 0) ? 'opacity-50' : 'opacity-100'} w-16 h-12 rounded-sm border bg-[#615656] max-sm:w-10 max-sm:h-10`}>
                                            <span className='text-3xl text-white lg:text-lg'>+</span>
                                        </button>
                                    </div>
                                    <div className='flex justify-start items-start w-full'>
                                        <button className='text-xl font-normal text-white bg-[#615656] p-2 rounded-md pl-24 pr-24 tracking-normal hover:animate-bounce max-sm:pl-6 max-sm:pr-6 max-sm:text-lg lg:pr-12 lg:pl-12'>Add to Cart</button>
                                    </div>
                                </div>
                                {props.productFreebies ? (
                                        <>
                                            <h1 className='text-xl max-sm:flex max-sm:justify-center max-sm:items-center w-full max-sm:mt-12 lg:mt-12'>Select Freebies:</h1>
                                            <span className='h-[2px] w-[80%] bg-slate-700 mt-4 border-b border-slate-700 max-sm:w-[100%] lg:w-[90%]' />
                                        </>
                                    ) : (
                                        null
                                    )}
                                <div className='mt-8 w-full h-full flex justify-start items-start max-sm:justify-center max-sm:items-center'>
                                    <div className='grid 2xl:grid-cols-4 lg:grid-cols-3 gap-6 max-sm:grid-cols-2 max-sm:p-4 max-sm:max-h-[50dvh] max-sm:overflow-auto'>
                                    {freebiesDataViewing?.map((dataItem, dataIndex) => (
                                        <div key={dataIndex}>
                                            {dataItem.freebiesData?.map((freebie) => (
                                                <div key={freebie?.freebiesId ?? dataIndex} className="flex flex-col items-center border p-4 rounded-sm text-center gap-2">
                                                    <label htmlFor={`default-radio-${freebie?.freebiesId ?? dataIndex}`} className="ms-2 text-sm font-normal line-clamp-1">
                                                        {freebie.freebiesName}
                                                    </label>
                                                    {freebie.freebiesImg ?
                                                        <img className='w-28 h-28' src={`data:image/jpeg;base64,${freebie.freebiesImg}`} alt={freebie.freebiesName} />
                                                        :
                                                        <img className='w-28 h-28' src={NoImage} alt='Image of no displayed image.' />
                                                    } 
                                                    <input
                                                        id={`default-radio-${freebie?.freebiesId ?? dataIndex}`}
                                                        type="radio"
                                                        value=""
                                                        onChange={() => setSelectedFreebie(freebie.freebiesName)}
                                                        name="default-radio"
                                                        className="h-5 w-5 accent-[#615656] p-2 my-3"
                                                        defaultChecked={dataIndex === 0}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                <h1 className='mt-24 text-xl max-sm:flex max-sm:justify-center max-sm:items-center w-full max-sm:mt-12 lg:mt-12'>Product Details</h1>
                                <span className='h-[2px] w-[80%] bg-slate-700 mt-4 border-b border-slate-700 max-sm:w-[100%] lg:w-[90%]' />
                                <div className='flex flex-col justify-start items-start w-full mt-8 pb-2 max-sm:flex max-sm:justify-center max-sm:items-center max-sm:w-full max-sm:pb-48'>
                                    <div className='w-[80%] text-md text-start max-sm:text-md'>
                                        {props?.description1 as string}
                                    </div>
                                    <div className='mt-6 text-md max-sm:text-md'>
                                    {props.description2 ? (
                                        <ul>
                                            {props.description2
                                                .replace(/\\/g, '')
                                                .replace(/"/g, '')
                                                .replace(/\[/g, '')
                                                .replace(/\]/g, '')
                                                .split(',')
                                                .map((descItem: string, index: number) => (
                                                    <li key={index}>• {descItem.trim()}</li>
                                                ))}
                                        </ul>
                                    ) : (
                                        null
                                    )}
                                    </div>
                                </div>

                                 {/* Review */}
                                <h1 className='mt-12 text-xl max-sm:flex max-sm:justify-center max-sm:items-center w-full max-sm:mt-12 lg:mt-8'>Product Reviews</h1>
                                <span className='h-[2px] w-[80%] bg-slate-700 mt-4 border-b border-slate-700 max-sm:w-[100%] lg:w-[90%]' />
                                <div className='flex flex-col justify-start items-start w-full mt-8 pb-24 max-sm:flex max-sm:justify-center max-sm:items-center max-sm:w-full max-sm:pb-48'>
                                    <div className='w-full h-full flex'>
                                        <div className='flex flex-1 justify-start items-start gap-4 mt-2'>
                                            <StarRatings
                                                rating={4.5}
                                                starRatedColor="#FCD53F"
                                                numberOfStars={5}
                                                name='rating'
                                                starDimension='26px'
                                                starSpacing='3px' 
                                            />
                                            <span className='text-lg mt-[2px]'>({4.5} Stars)</span>
                                        </div>
                                        <div className='flex flex-1 justify-center items-center'>
                                            <button  className='border p-2 pl-6 pr-6 hover:bg-slate-300'>Write a review</button>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col justify-start items-start mt-10 gap-8'>
                                        <div className='w-full'>
                                            <div className='w-full flex flex-col'>
                                                <div className='flex'>
                                                    <h1 className='text-lg font-semibold flex flex-1 justify-start items-start'>Absolutely comfortable!!</h1>
                                                </div>
                                                <div className='flex w-full'>
                                                    <span className='flex flex-1 justify-start items-start text-[#707072] gap-4'>Tony J:   
                                                        <div className='flex flex-1 justify-start items-start'>
                                                            <StarRatings
                                                                rating={4.5}
                                                                starRatedColor="#FCD53F"
                                                                numberOfStars={5}
                                                                name='rating'
                                                                starDimension='16px' 
                                                                starSpacing='4px'
                                                            />
                                                        </div>
                                                    </span>  
                                                    <span className='flex flex-1 justify-center items-center text-[#707072]'>3 days ago</span> 
                                                </div>
                                                <div className='h-full mt-2 flex w-[85%]'>
                                                    <p>Absorbency: One of the most crucial factors in diaper performance is its absorbency. A good diaper should be able to quickly absorb and lock away moisture to keep the baby's skin dry and prevent rashes.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='w-full'>
                                            <div className='w-full flex flex-col'>
                                                <div className='flex'>
                                                    <h1 className='text-lg font-semibold flex flex-1 justify-start items-start'>So comfortable and stylish!</h1>
                                                </div>
                                                <div className='flex w-full'>
                                                <span className='flex flex-1 justify-start items-start text-[#707072] gap-4'>Addrienne:   
                                                        <div className='flex flex-1 justify-start items-start'>
                                                            <StarRatings
                                                                rating={4.5}
                                                                starRatedColor="#FCD53F"
                                                                numberOfStars={5}
                                                                name='rating'
                                                                starDimension='16px' 
                                                                starSpacing='4px'
                                                            />
                                                        </div>
                                                    </span>  
                                                    <span className='flex flex-1 justify-center items-center text-[#707072]'>6 days ago</span> 
                                                </div>
                                                <div className='h-full mt-2 flex w-[85%]'>
                                                    <p>The cost of diapers can vary significantly depending on the brand, quality, and features. It's essential to find a balance between cost and performance that fits your budget. thank you</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>


                            </div>
                        </div>
                        {/* Sticky Add to Cart */}
                            <div className='absolute w-full bottom-0 bg-white pb-4 pl-4 pr-4 border rounded-t-2xl shadow-gray-300 shadow-inner mobile-view'>
                                <div className='mt-2 w-[60%] flex flex-col justify-start items-start gap-2 max-sm:w-[100%] max-sm:pl-12 max-sm:pr-12 max-sm:justify-center max-sm:items-center'>
                                    <span className='text-xl font-normal tracking-wide'>ONLY <span className='text-[#DB1461]'>{props?.currentQuantity}</span> LEFT</span>
                                    <div className='w-full bg-gray-200 rounded-sm h-3 dark:bg-gray-400'>
                                        <div className='bg-[#615656] h-3 rounded-sm' style={progressBarStyle}></div>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center w-full mt-4'>
                                    <div className='flex justify-start items-start gap-1 w-[20%] max-sm:justify-center max-sm:w-[70%]'>
                                        <button disabled={stateQuantity === 1} onClick={onMinus} className={`${stateQuantity === 1 ? 'opacity-50' : 'opacity-100'} w-12 h-12 border rounded-sm bg-[#615656] max-sm:w-10 max-sm:h-10`}>
                                            <span className='text-3xl text-white'>-</span>
                                        </button>
                                        <input value={stateQuantity} className='w-10 h-12 border-t border-b text-center max-sm:w-8 max-sm:h-10' />
                                        <button onClick={onAdd} className='w-12 h-12 border rounded-sm bg-[#615656] max-sm:w-10 max-sm:h-10'>
                                            <span className='text-3xl text-white'>+</span>
                                        </button>
                                    </div>
                                    <div className='flex justify-start items-start w-full'>
                                        <button className='text-3xl font-normal text-white bg-[#615656] p-1 rounded-md pl-24 pr-24 tracking-widest hover:animate-bounce max-sm:pl-6 max-sm:pr-6 max-sm:text-lg'>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                </div>
        </div>
        </Modal>
    )
}
