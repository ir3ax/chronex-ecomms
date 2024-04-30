import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import { SlPeople } from "react-icons/sl";

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    firstName: string;
    lastName: string;
    emailAddress: string;
    contactNumber: string;
}

export const CustomerModalView = (props: Xprox) => {

    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[45rem] h-[30rem] bg-white p-8 overflow-auto rounded-xl'>
              <button onClick={props.handleClose} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
              </button>
              <div className='mt-12 w-full flex flex-col justify-center items-center gap-4'>
                  <SlPeople className='w-16 h-16 text-black' />
                  <h1 className='font-semibold text-lg'>Customer Info:</h1>
                  <div className='w-full h-full flex flex-col border p-6 rounded-lg'>
                    <div className='mt-4 w-full h-full flex justify-start items-start gap-2'>
                        <span className='font-bold text-gray-700'>First Name:</span>
                        <span className='font-normal text-gray-500'>{props.firstName}</span>
                    </div>
                    <div className='w-full h-full flex justify-start items-start gap-2'>
                        <span className='font-bold text-gray-700'>Last Name:</span>
                        <span className='font-normal text-gray-500'>{props.lastName}</span>
                    </div>
                    <div className='w-full h-full flex justify-start items-start gap-2'>
                        <span className='font-bold text-gray-700'>Email Address:</span>
                        <span className='font-normal text-gray-500'>{props.emailAddress}</span>
                    </div>
                    <div className='w-full h-full flex justify-start items-start gap-2'>
                        <span className='font-bold text-gray-700'>Contact Number:</span>
                        <span className='font-normal text-gray-500'>{props.contactNumber}</span>
                    </div>
                  </div>
              </div>
        </div>
      </Modal>
    )
}

