import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReviewsModalUpdate } from './reviews';
import { UpdateReviewsRequest, UpdateReviewsResponse, updateReviewsRequest } from '../../../../../service/reviews/schema';
import { updateReviews } from '../../../../../service/reviews';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    reviewsId: string;
    productId: string;
    reviewsName: string;
    reviewsSubject: string;
    reviewsMessage: string;
    reviewsStarRating: number;
}

export const ModalViewReviewsUpdate = (props: Xprox) => {

  const reviewsId = props.reviewsId ? props.reviewsId : uuidv4();
  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  const reviewsFormUpdate = useForm<UpdateReviewsRequest>({
    defaultValues: {
        reviewsId: reviewsId,
        productId: props.productId,
        reviewsName: props.reviewsName,
        reviewsSubject: props.reviewsSubject,
        reviewsMessage: props.reviewsMessage,
        reviewsStarRating: props.reviewsStarRating
    },
    mode: 'onChange',
    resolver: zodResolver(updateReviewsRequest),
  });

  const { isDirty } = reviewsFormUpdate.formState;

  const { mutate: updateReviewsMU } = useMutation<
    UpdateReviewsResponse,
    AxiosError,
    UpdateReviewsRequest
  >((data) => updateReviews(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('reviews-data');
      notify()
      reviewsFormUpdate.reset();
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleUpdateReviews = async (data: UpdateReviewsRequest) => {
    const params: UpdateReviewsRequest = {
        reviewsId: reviewsId,
        productId: data.productId,
        reviewsName: data.reviewsName,
        reviewsSubject: data.reviewsSubject,
        reviewsMessage: data.reviewsMessage,
        reviewsStarRating: data.reviewsStarRating
    };
    updateReviewsMU(params);
  };

  const handleCloseUpdate = () => {
    reviewsFormUpdate.reset();
    props.handleClose()
  }

  return (
    <Modal open={props.isVisible} onClose={handleCloseUpdate}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={handleCloseUpdate} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
            </button>
            <Form {...reviewsFormUpdate}>
              <form onSubmit={reviewsFormUpdate.handleSubmit(handleUpdateReviews)} className='mt-6 w-full h-full'>
              <Stepper
                    strokeColor='#17253975'
                    fillStroke='#172539'
                    activeColor='#172539'
                    activeProgressBorder='2px solid #17253975'
                    submitBtn={<button className={`stepperBtn ${!isDirty? 'opacity-55' : null}`} 
                    disabled={ !isDirty? true : false}
                    >Submit</button>}
                    continueBtn={<button className='stepperBtn'>Next</button>}
                    backBtn={<button className='stepperBtn'>Back</button>}
                    >
                    <div className='stepperSubDiv'>
                        <ReviewsModalUpdate productId={props.productId} reviewsName={props.reviewsName} reviewsSubject={props.reviewsSubject} reviewsMessage={props.reviewsMessage} reviewsStarRating={props.reviewsStarRating}  />
                    </div>
                    </Stepper>
              </form>
            </Form>
      </div>
    </Modal>
  )
}

