import { Modal } from '../../../../../components/modal';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { DeleteHomeImagesRequest, DeleteHomeImagesResponse, deleteHomeImagesRequest } from '../../../../../service/home-images/schema';
import { deleteHomeImages } from '../../../../../service/home-images';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    homeImagesId: string;
}

export const DeleteModalView = (props: Xprox) => {

  const queryClient = useQueryClient();
  const notify = () => toast.error("Images deleted!");
  const homeImagesId = props.homeImagesId ? props.homeImagesId : uuidv4();

  const homeImagesFormDelete = useForm<DeleteHomeImagesRequest>({
    defaultValues: {
        homeImagesId: homeImagesId,
    },
    mode: 'onChange',
    resolver: zodResolver(deleteHomeImagesRequest),
  });

  const { mutate: deleteHomeImagesMu } = useMutation<
        DeleteHomeImagesResponse,
        AxiosError,
        string
    >(deleteHomeImages, {
        onSuccess: () => {
            queryClient.invalidateQueries('home-images-data');
            notify();
            props.handleClose();
        },
        onError: (error: unknown) => {
            console.log(error);
        },
    });

  const handleDeleteHomeImages = async () => {
    deleteHomeImagesMu(homeImagesId);
  };

  return (
    <Modal open={props.isVisible} onClose={props.handleClose}>
      <div className='flex flex-col justify-start w-[42rem] h-[22rem] bg-white p-8 overflow-auto'>
            <Form {...homeImagesFormDelete}>
              <form onSubmit={homeImagesFormDelete.handleSubmit(handleDeleteHomeImages)} className='w-full h-full'>
                <div className='w-full h-full flex flex-col justify-center items-start'>
                  <div className='w-full flex flex-col justify-center items-center gap-6 p-12'>
                    <RiDeleteBin5Fill className='w-24 h-24 text-[#172539]' />
                    <span className='text-xl tracking-wide text-center'>Are you sure you want to delete this collection of images?</span>
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

