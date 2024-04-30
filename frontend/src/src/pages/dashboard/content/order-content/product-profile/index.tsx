import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import { BiSolidPackage } from "react-icons/bi";

interface Product {
    productId: string;
    productName: string;
    quantity: number;
    discountedPrice: number;
    freebies: string;
}

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    product: Product[];
}

export const ProductModalView = (props: Xprox) => {

    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[45rem] h-[40rem] bg-white p-8 overflow-auto rounded-xl'>
              <button onClick={props.handleClose} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
              </button>
              <div className='mt-12 w-full flex flex-col justify-center items-center gap-4'>
                <BiSolidPackage className='w-36 h-36 text-black' />
                <h1 className='font-semibold text-lg'>Product Info:</h1>
                {
                    props.product.map((item, key) => (
                       
                        <div key={key} className='w-full h-full flex flex-col border p-4 rounded-lg'>
                            <div className='w-full h-full flex justify-start items-start gap-2'>
                                <span className='font-bold text-gray-700'>Product ID:</span>
                                <span className='font-normal text-gray-500'>{item.productId}</span>
                            </div>
                            <div className='w-full h-full flex justify-start items-start gap-2'>
                                <span className='font-bold text-gray-700'>Product Name:</span>
                                <span className='font-normal text-gray-500'>{item.productName}</span>
                            </div>
                            <div className='w-full h-full flex justify-start items-start gap-2'>
                                <span className='font-bold text-gray-700'>Price:</span>
                                <span className='font-normal text-gray-500'>{item.discountedPrice}</span>
                            </div>
                            <div className='w-full h-full flex justify-start items-start gap-2'>
                                <span className='font-bold text-gray-700'>Quantity:</span>
                                <span className='font-normal text-gray-500'>{item.quantity}</span>
                            </div>
                            {
                                item.freebies ? 
                                <div className='w-full h-full flex justify-start items-start gap-2'>
                                    <span className='font-bold text-gray-700'>Freebies:</span>
                                    <span className='font-normal text-gray-500'>{item.freebies}</span>
                                </div>
                                :
                                null
                            }
                        </div>
                       
                    ))
                }
              </div>
        </div>
      </Modal>
    )
}

