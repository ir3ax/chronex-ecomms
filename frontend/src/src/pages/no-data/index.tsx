import NoDataImage from '../../assets/utilities/no-data-image.png';

export const NoData = () => {
    return(
        <div className='mt-12 w-full h-full flex flex-col justify-center items-center gap-2'>
            <img src={NoDataImage} alt='No Data Image'/>
            <span className='text-sm font-normal text-gray-500'>No Data Available.</span>
        </div>
    )
}