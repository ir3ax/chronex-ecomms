
import { IoIosClose } from 'react-icons/io';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveReviewsRequest, SaveReviewsResponse, saveReviewsRequest } from '../../../../../service/reviews/schema';
import { Modal } from '../../../../../components/modal';
import { Form } from '../../../../../components/ui/form';
import Stepper from '../../../../../components/stepper';
import { ReviewsInputModal } from './reviews';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { saveReviews } from '../../../../../service/reviews';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { reviewsIdAtom, reviewsRatingAtom } from '../../../../../atom/reviewsAtom';
import { v4 as uuidv4 } from 'uuid';


interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
}

export const ModalViewReviews = (props: Xprox) => {

    const queryClient = useQueryClient();
    const notify = () => toast.success("Successfully added!");
    const [ reviewsRatingValue, setReviewRatingfValue ] = useAtom(reviewsRatingAtom);
    const [ reviewsIdValue, setReviewsIdValue ] = useAtom(reviewsIdAtom);
    const reviewId = reviewsIdValue ? reviewsIdValue : uuidv4();

    const reviewsForm = useForm<SaveReviewsRequest>({
      defaultValues: {
          productId: '',
          reviewsName: '',
          reviewsSubject: '',
          reviewsMessage: '',
          reviewsStarRating: 0.0,
      },
      mode: 'onChange',
      resolver: zodResolver(saveReviewsRequest),
    });

    const { mutate: saveReviewsMU } = useMutation<
      SaveReviewsResponse,
      AxiosError,
      SaveReviewsRequest
    >((data) => saveReviews(data), {
      onSuccess: () => {
        queryClient.invalidateQueries('reviews-data');
        reviewsForm.reset();
        setReviewRatingfValue(0);
        setReviewsIdValue('');
        notify()
        props.handleClose()
      },
      onError: (error: unknown) => {
      console.log(error);
    },
    });

    const handleSaveReviews = async (data: SaveReviewsRequest) => {
      const params: SaveReviewsRequest = {
          productId: reviewId,
          reviewsName: data.reviewsName,
          reviewsSubject: data.reviewsSubject,
          reviewsMessage: data.reviewsMessage,
          reviewsStarRating: reviewsRatingValue
      };
    saveReviewsMU(params);
    };

    const handleCloseAdd = () => {
    props.handleClose()
    }


    return (
        <Modal open={props.isVisible} onClose={handleCloseAdd}>
        <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
              <button onClick={handleCloseAdd} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
              </button>
              <Form {...reviewsForm}>
                <form onSubmit={reviewsForm.handleSubmit(handleSaveReviews)}  className='mt-2 w-full h-full'>
                <Stepper
                      strokeColor='#17253975'
                      fillStroke='#172539'
                      activeColor='#172539'
                      activeProgressBorder='2px solid #17253975'
                      submitBtn={<button className={`stepperBtn ${ 
                        (reviewsIdValue === '') ||
                        (reviewsForm.getValues('reviewsName') === '') || 
                        (Number(reviewsForm.getValues('reviewsStarRating')) === 0)
                        ? 'opacity-55' : null}`} 
                        disabled={
                        (reviewsIdValue === '') ||
                        (reviewsForm.getValues('reviewsName') === '') || 
                        (Number(reviewsForm.getValues('reviewsStarRating')) === 0)
                        ? true : false
                        }>Submit</button>}
                      continueBtn={<button className='stepperBtn'>Next</button>}
                      backBtn={<button className='stepperBtn'>Back</button>}
                      >
                      <div className='stepperSubDiv'>
                          <ReviewsInputModal />
                      </div>
                      </Stepper>
                </form>
              </Form>
        </div>
      </Modal>
    )
}

