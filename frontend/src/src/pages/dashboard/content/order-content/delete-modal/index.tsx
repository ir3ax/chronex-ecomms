import { Modal } from '../../../../../components/modal';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOrderRequest, DeleteOrderResponse, deleteOrderRequest } from '../../../../../service/order/schema';
import { deleteOrder } from '../../../../../service/order';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    orderId: string;
    orderStatus: string;
}

export const ModalViewDeleteOrder = (props: Xprox) => {

  const orderId = props.orderId ? props.orderId : uuidv4();
  const queryClient = useQueryClient();
  const notify = () => toast.error("Order deleted!");

  const orderFormDelete = useForm<DeleteOrderRequest>({
    defaultValues: {
        orderId: orderId,
        orderStatus: props.orderStatus,
    },
    mode: 'onChange',
    resolver: zodResolver(deleteOrderRequest),
  });

  const { mutate: deleteOrderMu } = useMutation<
    DeleteOrderResponse,
    AxiosError,
    DeleteOrderRequest
  >((data) => deleteOrder(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('pending-order-data');
      queryClient.invalidateQueries('active-order-data');
      queryClient.invalidateQueries('shipped-order-data');
      queryClient.invalidateQueries('delivered-order-data');
      queryClient.invalidateQueries('cancelled-order-data');
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleDeleteOrder = async () => {
    const params: DeleteOrderRequest = {
        orderId: orderId,
        orderStatus: "DEL"
    };
    deleteOrderMu(params)
    };


    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[42rem] h-[22rem] bg-white p-8 overflow-auto'>
              <Form {...orderFormDelete}>
                <form onSubmit={orderFormDelete.handleSubmit(handleDeleteOrder)} className='w-full h-full'>
                  <div className='w-full h-full flex flex-col justify-center items-start'>
                    <div className='w-full flex flex-col justify-center items-center gap-6 p-12'>
                      <RiDeleteBin5Fill className='w-24 h-24 text-[#172539]' />
                      <span className='text-xl tracking-wide text-center'>Are you sure you want to delete this order?</span>
                    </div>

                    <div className='w-full flex justify-end items-center gap-4'>
                      <button type='button' className='border pt-2 pb-2 pr-4 pl-4 bg-[#fcf8f7] text-black cursor-pointer hover:bg-[#dddada] rounded-md' onClick={props.handleClose}>CANCEL</button>
                      <button type='submit' className='border pt-2 pb-2 pr-4 pl-4 bg-[#F44537] text-white cursor-pointer hover:bg-[#d45951] rounded-md'>DELETE</button>
                    </div>
                  </div>
                  
                </form>
              </Form>
        </div>
      </Modal>
    )
}

