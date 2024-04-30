import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { v4 as uuidv4 } from 'uuid';
import { useAtomValue } from 'jotai';
import { toast } from 'react-toastify';
import { ProductModalUpdateQuantity } from './product';
import { updateProductQuantity } from '../../../../../service/product-service';
import { UpdateQuantityProductRequest, updateQuantityProductRequest, UpdateQuantityProductResponse } from '../../../../../service/product-service/schema';
import { productAdditionalOriginalQuantity, productAdditionalCurrentQuantity } from '../../../../../atom/productDetailsAtom';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    productId: string;
    productOriginalQuantity: number;
    productCurrentQuantity: number;
}

export const ProductModalViewUpdateQuantity = (props: Xprox) => {

  const updatedOriginalQuantityAtom = useAtomValue(productAdditionalOriginalQuantity);
  const updatedCurrentQuantityAtom = useAtomValue(productAdditionalCurrentQuantity);

  const productId = props.productId ? props.productId : uuidv4();
  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  const freebiesFormUpdateQuantity = useForm<UpdateQuantityProductRequest>({
    defaultValues: {
        productId: productId,
        productOriginalQuantity: props.productOriginalQuantity,
        productCurrentQuantity: props.productCurrentQuantity
    },
    mode: 'onChange',
    resolver: zodResolver(updateQuantityProductRequest),
  });

  const { mutate: updateProductQuantityMU } = useMutation<
    UpdateQuantityProductResponse,
    AxiosError,
    UpdateQuantityProductRequest
  >((data) => updateProductQuantity(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('product-data');
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleUpdateQuantityFreebies = async () => {
    const params: UpdateQuantityProductRequest = {
        productId: productId,
        productOriginalQuantity: updatedOriginalQuantityAtom,
        productCurrentQuantity: updatedCurrentQuantityAtom
    };
    updateProductQuantityMU(params)
  };


  return (
    <Modal open={props.isVisible} onClose={props.handleClose}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={props.handleClose} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
            </button>
            <Form {...freebiesFormUpdateQuantity}>
              <form onSubmit={freebiesFormUpdateQuantity.handleSubmit(handleUpdateQuantityFreebies)} className='mt-6 w-full h-full'>
              <Stepper
                    strokeColor='#17253975'
                    fillStroke='#172539'
                    activeColor='#172539'
                    activeProgressBorder='2px solid #17253975'
                    submitBtn={<button className={`stepperBtn ${updatedOriginalQuantityAtom === props.productOriginalQuantity ? 'opacity-55' : null}`} disabled={updatedOriginalQuantityAtom === props.productOriginalQuantity ? true : false}>Submit</button>}
                    continueBtn={<button className='stepperBtn'>Next</button>}
                    backBtn={<button className='stepperBtn'>Back</button>}
                    >
                    <div className='stepperSubDiv'>
                        <ProductModalUpdateQuantity productId={props.productId} productOriginalQuantity={props.productOriginalQuantity} productCurrentQuantity={props.productCurrentQuantity} />
                    </div>
                    </Stepper>
              </form>
            </Form>
      </div>
    </Modal>
  )
}


