import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { UpdateQuantityFreebiesRequest } from '../../../../../../service/freebies/schema';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { useEffect, useState } from 'react';
import { additionalCurrentQuantity, additionalOriginalQuantity } from '../../../../../../atom/freebiesAtom';
import { useAtom } from 'jotai';

interface Freebie {
  freebiesId: string;
  freebiesOriginalQuantity: number;
  freebiesCurrentQuantity: number;
}

export const FreebiesModalUpdateQuantityMinus = (props: Freebie) => {
  
  const freebiesFormQuantityMinus = useFormContext<UpdateQuantityFreebiesRequest>()
  const [additionalQuantity, setAdditionalQuantity] = useState<number>(0);
  const [updatedOriginalQuantityAtom, setUpdatedOriginalQuantityAtom] = useAtom(additionalOriginalQuantity);
  const [updatedCurrentQuantityAtom, setUpdatedCurrentQuantityAtom]  = useAtom(additionalCurrentQuantity);

  // Calculate the updated quantities based on the additional quantity input
  useEffect(() => {
    const additionalQty = additionalQuantity || 0;
    setUpdatedOriginalQuantityAtom(props.freebiesOriginalQuantity - additionalQty);
    setUpdatedCurrentQuantityAtom(props.freebiesCurrentQuantity - additionalQty);
  }, [additionalQuantity])
  
  // const { formState } = freebiesForm
  // const { isValid, isSubmitting } = formState
  // const shouldDisable = !isValid || isSubmitting

  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Freebies Update Quantity:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>

        <div className='w-[100%] flex flex-col gap-2'>
            <label>Deduct Quantity</label>
            <Input 
              id='freebiesOriginalQuantity'
              className='focus-visible:ring-[#63B38F]' 
              placeholder='Freebies Original Quantity'
              type='number'
              onChange={(e) => {
                setAdditionalQuantity(parseFloat(e.target.value));
              }} 
            />  
          </div>
        
        <div className='w-[100%] flex flex-col gap-2'>
            <label>Freebies Original Quantity</label>
            <FormField
                control={freebiesFormQuantityMinus.control}
                name='freebiesOriginalQuantity'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='freebiesOriginalQuantity'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Freebies Original Quantity'
                          type='number'
                          ref={field.ref}
                          name={field.name}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          onBlur={field.onBlur}
                          value={updatedOriginalQuantityAtom}
                          disabled
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
            <label>Freebies Current Quantity</label>
            <FormField
                control={freebiesFormQuantityMinus.control}
                name='freebiesCurrentQuantity'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='freebiesCurrentQuantity'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Freebies Current Quantity'
                          type='number'
                          ref={field.ref}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          value={updatedCurrentQuantityAtom}
                          disabled
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
