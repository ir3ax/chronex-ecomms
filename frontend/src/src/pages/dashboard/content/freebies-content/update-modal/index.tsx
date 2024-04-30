import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { FreebiesModalUpdate } from './freebies';
import { AxiosError } from 'axios';
import { UpdateFreebiesRequest, UpdateFreebiesResponse, updateFreebiesRequest } from '../../../../../service/freebies/schema';
import { updateFreebies } from '../../../../../service/freebies';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { freebiesStatusUpdateAtom } from '../../../../../atom/freebiesAtom';
import { useAtom } from 'jotai';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    freebiesId: string;
    freebiesName: string;
    freebiesImg: string;
    freebiesStorePrice: number;
    freebiesStatus: string;
}

export const ModalViewUpdate = (props: Xprox) => {

  const freebiesId = props.freebiesId ? props.freebiesId : uuidv4();
  const [ freebiesStatusValue ] = useAtom(freebiesStatusUpdateAtom);
  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  const freebiesFormUpdate = useForm<UpdateFreebiesRequest>({
    defaultValues: {
        freebiesId: freebiesId,
        freebiesName: props.freebiesName,
        freebiesImg: props.freebiesImg,
        freebiesStorePrice: props.freebiesStorePrice,
        freebiesStatus: props.freebiesStatus
    },
    mode: 'onChange',
    resolver: zodResolver(updateFreebiesRequest),
  });

  const { mutate: updateFreebiesMU } = useMutation<
    UpdateFreebiesResponse,
    AxiosError,
    UpdateFreebiesRequest
  >((data) => updateFreebies(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('freebies-data');
      notify()
      freebiesFormUpdate.reset();
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleUpdateFreebies = async (data: UpdateFreebiesRequest) => {
    const params: UpdateFreebiesRequest = {
        freebiesId: freebiesId,
        freebiesName: data.freebiesName,
        freebiesImg: data.freebiesImg,
        freebiesStorePrice: data.freebiesStorePrice,
        freebiesStatus: freebiesStatusValue
    };
    updateFreebiesMU(params);
};

const handleCloseUpdate = () => {
  freebiesFormUpdate.reset();
  props.handleClose()
}

  return (
    <Modal open={props.isVisible} onClose={handleCloseUpdate}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={handleCloseUpdate} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
            </button>
            <Form {...freebiesFormUpdate}>
              <form onSubmit={freebiesFormUpdate.handleSubmit(handleUpdateFreebies)} className='mt-6 w-full h-full'>
              <Stepper
                    strokeColor='#17253975'
                    fillStroke='#172539'
                    activeColor='#172539'
                    activeProgressBorder='2px solid #17253975'
                    submitBtn={<button className={`stepperBtn ${ 
                      (freebiesFormUpdate.getValues('freebiesName') === props.freebiesName || freebiesFormUpdate.getValues('freebiesName') === '') && 
                      (Number(freebiesFormUpdate.getValues('freebiesStorePrice')) === props.freebiesStorePrice || Number(freebiesFormUpdate.getValues('freebiesStorePrice')) === 0) &&
                      (freebiesFormUpdate.getValues('freebiesImg') === props.freebiesImg || freebiesFormUpdate.getValues('freebiesImg') === '') &&
                      (freebiesStatusValue === props.freebiesStatus || freebiesStatusValue === '')
                       ? 'opacity-55' : null}`}
                      disabled={
                      (freebiesFormUpdate.getValues('freebiesName') === props.freebiesName || freebiesFormUpdate.getValues('freebiesName') === '') && 
                      (Number(freebiesFormUpdate.getValues('freebiesStorePrice')) === props.freebiesStorePrice || Number(freebiesFormUpdate.getValues('freebiesStorePrice')) === 0) &&
                      (freebiesFormUpdate.getValues('freebiesImg') === props.freebiesImg || freebiesFormUpdate.getValues('freebiesImg') === '') &&
                      (freebiesStatusValue === props.freebiesStatus || freebiesStatusValue === '')
                      ? true : false
                      }
                      >Submit</button>}
                    continueBtn={<button className='stepperBtn'>Next</button>}
                    backBtn={<button className='stepperBtn'>Back</button>}
                    >
                    <div className='stepperSubDiv'>
                        <FreebiesModalUpdate freebiesId={props.freebiesId} freebiesName={props.freebiesName} freebiesImg={props.freebiesImg} freebiesStorePrice={props.freebiesStorePrice} freebiesStatus={props.freebiesStatus} />
                    </div>
                    </Stepper>
              </form>
            </Form>
      </div>
    </Modal>
  )
}

