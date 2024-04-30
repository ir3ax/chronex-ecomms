import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { FreebiesModalUpdateQuantityMinus } from './freebies';
import { AxiosError } from 'axios';
import { UpdateQuantityFreebiesRequest, UpdateQuantityFreebiesResponse, updateQuantityFreebiesRequest } from '../../../../../service/freebies/schema';
import { updateFreebiesQuantity } from '../../../../../service/freebies';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { v4 as uuidv4 } from 'uuid';
import { useAtomValue } from 'jotai';
import { additionalCurrentQuantity, additionalOriginalQuantity } from '../../../../../atom/freebiesAtom';
import { toast } from 'react-toastify';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    freebiesId: string;
    freebiesOriginalQuantity: number;
    freebiesCurrentQuantity: number;
}

export const ModalViewUpdateQuantityMinus = (props: Xprox) => {

  const updatedOriginalQuantityAtom = useAtomValue(additionalOriginalQuantity);
  const updatedCurrentQuantityAtom = useAtomValue(additionalCurrentQuantity);

  const freebiesId = props.freebiesId ? props.freebiesId : uuidv4();
  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  const freebiesFormUpdateQuantityMinus = useForm<UpdateQuantityFreebiesRequest>({
    defaultValues: {
        freebiesId: freebiesId,
        freebiesOriginalQuantity: 0.0,
        freebiesCurrentQuantity: 0.0
    },
    mode: 'onChange',
    resolver: zodResolver(updateQuantityFreebiesRequest),
  });

  const { mutate: updateFreebiesQuantityMU } = useMutation<
    UpdateQuantityFreebiesResponse,
    AxiosError,
    UpdateQuantityFreebiesRequest
  >((data) => updateFreebiesQuantity(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('freebies-data');
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleUpdateQuantityFreebies = async () => {
    const params: UpdateQuantityFreebiesRequest = {
        freebiesId: freebiesId,
        freebiesOriginalQuantity: updatedOriginalQuantityAtom,
        freebiesCurrentQuantity: updatedCurrentQuantityAtom
    };
    updateFreebiesQuantityMU(params)
};


    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
              <button onClick={props.handleClose} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
              </button>
              <Form {...freebiesFormUpdateQuantityMinus}>
                <form onSubmit={freebiesFormUpdateQuantityMinus.handleSubmit(handleUpdateQuantityFreebies)} className='mt-6 w-full h-full'>
                <Stepper
                      strokeColor='#17253975'
                      fillStroke='#172539'
                      activeColor='#172539'
                      activeProgressBorder='2px solid #17253975'
                      submitBtn={<button className={`stepperBtn ${updatedOriginalQuantityAtom === props.freebiesOriginalQuantity ? 'opacity-55' : null}`} disabled={updatedOriginalQuantityAtom === props.freebiesOriginalQuantity ? true : false}>Submit</button>}
                      continueBtn={<button className='stepperBtn'>Next</button>}
                      backBtn={<button className='stepperBtn'>Back</button>}
                      >
                      <div className='stepperSubDiv'>
                          <FreebiesModalUpdateQuantityMinus freebiesId={props.freebiesId} freebiesOriginalQuantity={props.freebiesOriginalQuantity} freebiesCurrentQuantity={props.freebiesCurrentQuantity} />
                      </div>
                      </Stepper>
                </form>
              </Form>
        </div>
      </Modal>
    )
}


