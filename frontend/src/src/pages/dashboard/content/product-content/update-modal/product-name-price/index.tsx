import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '../../../../../../components/input';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { UpdateProductRequest } from '../../../../../../service/product-service/schema';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { productDiscountedPriceAtomUpdate, productStatusUpdateAtom } from '../../../../../../atom/productDetailsAtom';

interface NameProps {
  productName: string;
  discount: number,
  originalPrice: number,
  supplierPrice: number,
  discountedPrice: number,
  productSold: number,
  productStatus: string
}

export const ProductNameUpdate = (props: NameProps) => {

  const productFormUpdate = useFormContext<UpdateProductRequest>()
  const [ productStatusValueUpdate, setProductStatusUpdateValue ] = useAtom(productStatusUpdateAtom);

  useEffect(() => {
    setProductStatusUpdateValue(props.productStatus)
  },[props.productStatus])

  const originalPrice = useWatch({
    control: productFormUpdate.control,
    name: 'originalPrice',
    defaultValue: 0,
  });

  const discount = useWatch({
    control: productFormUpdate.control,
    name: 'discount',
    defaultValue: 0,
  });

  const [discountedPrice, setDiscountedPrice] = useAtom(productDiscountedPriceAtomUpdate);

  useEffect(() => {

    setDiscountedPrice(0)

    if (typeof originalPrice === 'string' && props.discount === undefined) {
      const originalPriceValue = parseFloat(originalPrice);
      if (!isNaN(originalPriceValue)) {
        setDiscountedPrice(originalPriceValue);
      }
    }

    if (typeof discount === 'string' && typeof originalPrice === 'number') {
      const discountValue = parseFloat(discount);
      if (!isNaN(discountValue)) {
        const discountedPriceValue = props.originalPrice * (1 - discountValue / 100);
        setDiscountedPrice(discountedPriceValue);
      }
    }
    else if (typeof originalPrice === 'string' && typeof discount === 'number' && props.discount !== undefined) {
      const originalPriceValue = parseFloat(originalPrice);
      if (!isNaN(originalPriceValue)) {
        const discountedPriceValue = originalPriceValue * (1 - props.discount / 100);
        setDiscountedPrice(discountedPriceValue);
      }
    }else if (typeof originalPrice === 'string' && typeof discount === 'string') {
      const originalPriceValue = parseFloat(originalPrice);
      const discountValue = parseFloat(discount);
      if (!isNaN(originalPriceValue) && !isNaN(discountValue)) {
        const discountedPriceValue = originalPriceValue * (1 - discountValue / 100);
        setDiscountedPrice(discountedPriceValue);
      }
    }
  }, [originalPrice, discount, discountedPrice]);

  return (
    <div className='w-full pb-8'> 
    <div className='w-full  flex  justify-start items-start'>
      <h1 className='text-lg'>Product Details:</h1>
    </div>
    <div className='w-full flex flex-col gap-6'>
        <div className='w-full mt-6 row flex gap-6'>
          <div className='w-full flex flex-col gap-2'>
            <label>Product Name</label>
            <FormField
              control={productFormUpdate.control}
              name='productName'
              render={({ field, fieldState }) => (
                  <FormItem className='col-span-full'>
                      <FormControl>
                      <Input 
                        id='productName'
                        className='focus-visible:ring-[#63B38F]' 
                        placeholder='Product Name'
                        type='text'
                        ref={field.ref}
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        defaultValue={props.productName}
                      />
                      </FormControl>
                      <FormDescription className='text-red-500'>
                          {fieldState.error?.message}
                      </FormDescription>
                  </FormItem>
              )}
            />
          </div>
          <div className='w-full flex flex-col gap-2'>
                <label>Product Sold</label>
                <FormField
                  control={productFormUpdate.control}
                  name='productSold'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='productSold'
                            className='focus-visible:ring-[#63B38F]' 
                            placeholder='Product Sold'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            defaultValue={props.productSold}
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

        <div className='w-full flex flex-col gap-4'>
          <div className='w-full flex gap-6'>

            <div className='w-full flex flex-col gap-2'>
              <label>Supplier Price</label>
              <FormField
                  control={productFormUpdate.control}
                  name='supplierPrice'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='supplierPrice'
                            className='focus-visible:ring-[#63B38F]' 
                            placeholder='Supplier Price'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            defaultValue={props.supplierPrice}
                          />
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
                />
            </div>
            <div className='w-full flex flex-col gap-2'>
              <label>Original Price (w/o discount)</label>
              <FormField
                  control={productFormUpdate.control}
                  name='originalPrice'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='originalPrice'
                            className='focus-visible:ring-[#63B38F]' 
                            placeholder='Original Price'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            defaultValue={props.originalPrice}
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

          <div className='w-full flex gap-6'>
            <div className='w-full flex flex-col gap-2'>
              <label>Discount</label>
              <FormField
                  control={productFormUpdate.control}
                  name='discount'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='discount'
                            className='focus-visible:ring-[#63B38F]' 
                            placeholder='Discount'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            defaultValue={props.discount}
                          />
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
                />
            </div>
            <div className='w-full flex flex-col gap-2'>
              <label>Discounted Price</label>
              <FormField
                  control={productFormUpdate.control}
                  name='discountedPrice'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='discoudiscountedPricent'
                            className='focus-visible:ring-[#63B38F] text-[#66fcb9]' 
                            placeholder='Discounted Price'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            value={discountedPrice !== 0 ? discountedPrice.toFixed(2) : props.discountedPrice.toFixed(2)}
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
          <div className='w-[97%] flex flex-col gap-2'>
            <label>Product Status</label>
            <FormField
                control={productFormUpdate.control}
                name='productStatus'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <select
                        name={field.name}
                        className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        value={productStatusValueUpdate}
                        onChange={(event) => setProductStatusUpdateValue(event.target.value)}
                        >
                          <option value='' disabled>
                              Select Status
                          </option>
                          
                          <option value="ACT">
                              ACTIVE
                          </option>
                          <option value="INC">
                              INACTIVE
                          </option>
                          <option value="SOLD">
                              SOLD
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

        </div>
      </div>
    </div>
  );
}
