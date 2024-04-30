import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { UpdateOrderRequest } from '../../../../../../service/order/schema';
import { useEffect } from 'react';

interface CustomerProps{
  firstName: string,
  lastName: string,
  emailAddress: string,
  contactNumber: string,
}

export const AddCustomerModalUpdate = (props: CustomerProps) => {
  
  const orderFormUpdate = useFormContext<UpdateOrderRequest>()
  
  useEffect(() => {
    orderFormUpdate.setValue('customer.firstName', props.firstName);
    orderFormUpdate.setValue('customer.lastName', props.lastName);
    orderFormUpdate.setValue('customer.emailAddress', props.emailAddress);
    orderFormUpdate.setValue('customer.contactNumber', props.contactNumber);
  }, [props.firstName, props.lastName, props.emailAddress, props.contactNumber]);

  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Customer Details:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='w-[100%] flex flex-col gap-2'>
            <label>First Name</label>
            <FormField
                control={orderFormUpdate.control}
                name='customer.firstName'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='customer.firstName'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='First Name'
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
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Last Name</label>
            <FormField
                control={orderFormUpdate.control}
                name='customer.lastName'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='customer.lastName'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Last Name'
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
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Email Address</label>
            <FormField
                control={orderFormUpdate.control}
                name='customer.emailAddress'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='customer.emailAddress'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Email Address'
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
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Contact Number</label>
            <FormField
                control={orderFormUpdate.control}
                name='customer.contactNumber'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='customer.contactNumber'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Contact Number'
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
