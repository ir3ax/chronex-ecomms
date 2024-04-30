import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { productAdditionalCurrentQuantity, productAdditionalOriginalQuantity } from '../../../../../../atom/productDetailsAtom';
import { UpdateQuantityProductRequest } from '../../../../../../service/product-service/schema';

interface Product {
  productId: string;
  productOriginalQuantity: number;
  productCurrentQuantity: number;
}

export const ProductModalUpdateQuantity = (props: Product) => {
  
  const productFormQuantity = useFormContext<UpdateQuantityProductRequest>()
  const [additionalQuantity, setAdditionalQuantity] = useState<number>(0);
  const [updatedOriginalQuantityAtom, setUpdatedOriginalQuantityAtom] = useAtom(productAdditionalOriginalQuantity);
  const [updatedCurrentQuantityAtom, setUpdatedCurrentQuantityAtom]  = useAtom(productAdditionalCurrentQuantity);

  // Calculate the updated quantities based on the additional quantity input3
  useEffect(() => {
    const additionalQty = additionalQuantity || 0;
    setUpdatedOriginalQuantityAtom(props.productOriginalQuantity + additionalQty);
    setUpdatedCurrentQuantityAtom(props.productCurrentQuantity + additionalQty);
  }, [additionalQuantity])


  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Product Update Quantity:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>

        <div className='w-[100%] flex flex-col gap-2'>
            <label>Add Quantity</label>
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
            <label>Product Original Quantity</label>
            <FormField
                control={productFormQuantity.control}
                name='productOriginalQuantity'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='productOriginalQuantity'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Product Original Quantity'
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
            <label>Product Current Quantity</label>
            <FormField
                control={productFormQuantity.control}
                name='productCurrentQuantity'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='productCurrentQuantity'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Product Current Quantity'
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
