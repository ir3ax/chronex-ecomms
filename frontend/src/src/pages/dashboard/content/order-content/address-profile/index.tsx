import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import { MdLocationCity } from "react-icons/md";

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    address: string;
    barangay: string;
    city: string;
    houseNumber: string;
    landMark: string;
    province: string; 
    region: string; 
}

export const AddressModalView = (props: Xprox) => {

    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[45rem] h-[33rem] bg-white p-8 overflow-auto rounded-xl pb-12'>
              <button onClick={props.handleClose} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
              </button>
              <div className='mt-12 w-full flex flex-col justify-center items-center gap-4'>
                    <MdLocationCity className='w-16 h-16 text-black' />
                    <h1 className='font-semibold text-lg'>Customer Address Info:</h1>
                    <div className='w-full h-full flex flex-col border p-6 rounded-lg'>
                        <div className='mt-4 w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>Address:</span>
                            <span className='font-normal text-gray-500'>{props.address}</span>
                        </div>
                        <div className='w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>Barangay:</span>
                            <span className='font-normal text-gray-500'>{props.barangay}</span>
                        </div>
                        <div className='w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>City:</span>
                            <span className='font-normal text-gray-500'>{props.city}</span>
                        </div>
                        <div className='w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>House Number:</span>
                            <span className='font-normal text-gray-500'>{props.houseNumber}</span>
                        </div>
                        <div className='w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>Landmark:</span>
                            <span className='font-normal text-gray-500'>{props.landMark}</span>
                        </div>
                        <div className='w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>Province:</span>
                            <span className='font-normal text-gray-500'>{props.province}</span>
                        </div>
                        <div className='w-full h-full flex justify-start items-start gap-2'>
                            <span className='font-bold text-gray-700'>Region:</span>
                            <span className='font-normal text-gray-500'>{props.region}</span>
                        </div>
                    </div>
              </div>
        </div>
      </Modal>
    )
}

