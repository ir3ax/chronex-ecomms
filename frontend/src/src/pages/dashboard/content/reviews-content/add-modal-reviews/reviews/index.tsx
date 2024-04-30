import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { SaveReviewsRequest } from '../../../../../../service/reviews/schema';
import StarRatings from 'react-star-ratings';
import { reviewsIdAtom, reviewsRatingAtom } from '../../../../../../atom/reviewsAtom';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllProduct } from '../../../../../../service/product-service';

export const ReviewsInputModal = () => {
  const [ reviewsIdValue, setReviewsIdValue ] = useAtom(reviewsIdAtom);
  const [ reviewsRatingValue, setReviewRatingfValue ] = useAtom(reviewsRatingAtom);
  const reviewsForm = useFormContext<SaveReviewsRequest>()
  const [sortOption] = useState('ATOZ');

  const { data: productData } = useQuery(
    ['product-data-reviews', sortOption],
    () => getAllProduct(sortOption || 'ATOZ'),
  );
  
  const handleRatingChange = (newRating: number) => {
    setReviewRatingfValue(newRating);
  };

  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Reviews:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>

                <div className='w-[100%] flex flex-col gap-2 mt-4'>
                    <label>Product</label>
                    <select
                    className='flex w-[100%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    value={reviewsIdValue}
                    onChange={(event) => setReviewsIdValue(event.target.value)}
                    >
                    <option value='' disabled>
                        Select Product
                    </option>
                    {productData && productData.productData && productData?.productData.map((item) => (
                        <option key={item.productId} value={item.productId}>
                        {item.productName}
                        </option>
                    ))}
                    </select>
                </div>

                <div className='w-[100%] flex flex-col gap-2'>
                    <label>Rating</label>
                    <FormField
                        control={reviewsForm.control}
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
                    <label>Name</label>
                    <FormField
                        control={reviewsForm.control}
                        name='reviewsName'
                        render={({ field, fieldState }) => (
                            <FormItem className='col-span-full'>
                                <FormControl>
                                <Input 
                                id='reviewsName'
                                className='focus-visible:ring-[#63B38F]' 
                                placeholder='Input Name'
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
                    <label>Subject</label>
                    <FormField
                        control={reviewsForm.control}
                        name='reviewsSubject'
                        render={({ field, fieldState }) => (
                            <FormItem className='col-span-full'>
                                <FormControl>
                                <Input 
                                id='reviewsName'
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
                    <label>Message</label>
                    <FormField
                        control={reviewsForm.control}
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
        </div>
      </div>
    </div>
  );
}
