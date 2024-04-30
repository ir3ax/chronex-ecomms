import { Modal } from '../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import { Form, FormControl, FormDescription, FormField, FormItem } from '../../../components/ui/form';
// import { AxiosError } from 'axios';
// import { SaveFreebiesRequest, SaveFreebiesResponse, saveFreebiesRequest } from '../../../../../service/freebies/schema';
// import { saveFreebies } from '../../../../../service/freebies';
import { useForm } from 'react-hook-form'
// import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveReviewsRequest, SaveReviewsResponse, saveReviewsRequest } from '../../../service/reviews/schema';
import { Input } from '../../../components/input';
import StarRatings from 'react-star-ratings';
import { useAtom } from 'jotai';
import { reviewsRatingAtomPublic } from '../../../atom/reviewsAtom';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { saveReviews } from '../../../service/reviews';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    productId?: string;
}

export const ModalWriteReview = (props: Xprox) => {

const queryClient = useQueryClient();
const notify = () => toast.success("Reviews Submitted!");
const [ reviewsRatingValue, setReviewRatingValue ] = useAtom(reviewsRatingAtomPublic);

const handleRatingChange = (newRating: number) => {
    setReviewRatingValue(newRating);
};

const reviewsFormPublic = useForm<SaveReviewsRequest>({
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
      queryClient.invalidateQueries('reviews-data-public');
      reviewsFormPublic.reset();
      setReviewRatingValue(0);
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleSaveReviewsPublic = async (data: SaveReviewsRequest) => {
    const params: SaveReviewsRequest = {
        productId: props.productId || '',
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
              <Form {...reviewsFormPublic}>
                <form onSubmit={reviewsFormPublic.handleSubmit(handleSaveReviewsPublic)}  className='mt-2 w-full h-full flex flex-col gap-4'>
                    <div className='flex justify-center items-center text-lg'>
                        <p>Write a review</p>
                    </div>
                    <div className='w-[100%] flex flex-col gap-2 mt-4'>
                        <label className='ml-[2px]'>Rating<span className='ml-2 italic text-[12px] text-gray-400'>(required)</span></label>
                        <FormField
                        control={reviewsFormPublic.control}
                        name='reviewsStarRating'
                        render={({ field, fieldState }) => (
                            <FormItem className='col-span-full'>
                                <FormControl>
                                <StarRatings
                                    rating={reviewsRatingValue}
                                    starRatedColor="#FCD53F"
                                    numberOfStars={5}
                                    name={field.name}
                                    starDimension='32px' 
                                    changeRating={(e) => {field.onChange(e), handleRatingChange(e)}}
                                />
                                </FormControl>
                                <FormDescription className='text-red-500'>
                                    {fieldState.error?.message}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    </div>
                    <div className='w-[100%] flex flex-col gap-2'>
                        <label className='ml-[2px]'>Display Name<span className='ml-2 italic text-[12px] text-gray-400'>(required)</span></label>
                        <FormField
                            control={reviewsFormPublic.control}
                            name='reviewsName'
                            render={({ field, fieldState }) => (
                                <FormItem className='col-span-full'>
                                    <FormControl>
                                    <Input 
                                    id='reviewsName'
                                    className='focus-visible:ring-[#63B38F]' 
                                    placeholder='Input Display Name'
                                    type='text'
                                    ref={field.ref}
                                    name={field.name}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    />
                                    </FormControl>
                                    <FormDescription className='text-red-500'>
                                        {fieldState.error?.message}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-[100%] flex flex-col gap-2'>
                        <label className='ml-[2px]'>Subject</label>
                        <FormField
                            control={reviewsFormPublic.control}
                            name='reviewsSubject'
                            render={({ field, fieldState }) => (
                                <FormItem className='col-span-full'>
                                    <FormControl>
                                    <Input 
                                    id='reviewsSubject'
                                    className='focus-visible:ring-[#63B38F]' 
                                    placeholder='Input Subject'
                                    type='text'
                                    ref={field.ref}
                                    name={field.name}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    />
                                    </FormControl>
                                    <FormDescription className='text-red-500'>
                                        {fieldState.error?.message}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='w-[100%] flex flex-col gap-2'>
                        <label className='ml-[2px]'>Message</label>
                        <FormField
                            control={reviewsFormPublic.control}
                            name='reviewsMessage'
                            render={({ field, fieldState }) => (
                                <FormItem className='col-span-full'>
                                    <FormControl>
                                    <textarea 
                                    id='reviewsMessage'
                                    className='focus-visible:ring-[#63B38F] flex w-full h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50' 
                                    placeholder='Input Message'
                                    ref={field.ref}
                                    name={field.name}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    />
                                    </FormControl>
                                    <FormDescription className='text-red-500'>
                                        {fieldState.error?.message}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='mt-4 pb-12'>
                        <button type='submit'
                         className={`w-[80%] text-2xl font-normal text-white bg-[#615656] p-2 rounded-sm tracking-widest max-sm:pl-6 max-sm:pr-6 max-sm:text-lg lg:w-[100%] lg:text-xl max-sm:text-[16px] max-sm:w-[100%] ${ 
                            (reviewsFormPublic.getValues('reviewsName') === '') || 
                            (Number(reviewsFormPublic.getValues('reviewsStarRating')) === 0)
                            ? 'opacity-55' : 'hover:animate-bounce opacity-100'}
                        `}
                        disabled={
                            (reviewsFormPublic.getValues('reviewsName') === '') || 
                            (Number(reviewsFormPublic.getValues('reviewsStarRating')) === 0)
                            ? true : false
                            }
                         >Submit
                         </button>
                    </div>

                </form>
              </Form>
        </div>
      </Modal>
    )
}

