import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { UpdateOrderRequest } from '../../../../../../service/order/schema';
import { useAtom } from 'jotai';
import { orderStatusAtom } from '../../../../../../atom/orderAtom';
import { useEffect } from 'react';

interface CustomerProps{
  trackingId: string,
}

export const AddTrackingStatusModalUpdate = (props: CustomerProps) => {
  
  const orderFormUpdate = useFormContext<UpdateOrderRequest>()
  const [ orderStatusValue, setOrderStatusValue ] = useAtom(orderStatusAtom);

  
  useEffect(() => {
    orderFormUpdate.setValue('trackingId', props.trackingId);
  }, [props.trackingId]);


  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Tracking and Status Details:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Order Status</label>
            <FormField
                control={orderFormUpdate.control}
                name='orderStatus'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <select
                        name={field.name}
                        className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        value={orderStatusValue}
                        onChange={(event) => setOrderStatusValue(event.target.value)}
                        >
                        <option value='' disabled>
                            Select Status
                        </option>
                        
                        <option value="PEN">
                            PROCESSING
                        </option>
                        <option value="ACT">
                            ACTIVE
                        </option>
                        <option value="SHP">
                            SHIPPED
                        </option>
                        <option value="DLV">
                            DELIVERED
                        </option>
                        <option value="CAN">
                            CANCELLED
                        </option>
                        </select>
                        </FormControl>
                        <FormDescription className='text-red-500'>
                            {fieldState.error?.message}
                        </FormDescription>
                    </FormItem>
                )}
            />
          </div>
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Tracking No.</label>
            <FormField
                control={orderFormUpdate.control}
                name='trackingId'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='trackingId'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Tracking No.'
                          type='text'
                          ref={field.ref}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          value={field.value}
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
