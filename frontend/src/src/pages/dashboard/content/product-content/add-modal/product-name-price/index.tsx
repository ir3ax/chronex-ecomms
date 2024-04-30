import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '../../../../../../components/input';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { SaveProductRequest } from '../../../../../../service/product-service/schema';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { productCurrentQuantityAtom, productDiscountedPriceAtom, productStatusAtom } from '../../../../../../atom/productDetailsAtom';


export const ProductName = () => {

  const productForm = useFormContext<SaveProductRequest>()
  const [currentQuantityValue, setCurrentQuantityValue] = useAtom(productCurrentQuantityAtom)
  const [ productStatusValue, setProductStatusValue ] = useAtom(productStatusAtom);

  const originalPrice = useWatch({
    control: productForm.control,
    name: 'originalPrice',
    defaultValue: 0,
  });

  const discount = useWatch({
    control: productForm.control,
    name: 'discount',
    defaultValue: 0,
  });

  const [discountedPrice, setDiscountedPrice] = useAtom(productDiscountedPriceAtom);

  useEffect(() => {
    if (typeof originalPrice === 'string' && typeof discount === 'string') {
      const originalPriceValue = parseFloat(originalPrice);
      const discountValue = parseFloat(discount);
      if (!isNaN(originalPriceValue) && !isNaN(discountValue)) {
        const discountedPriceValue = originalPriceValue * (1 - discountValue / 100);
        setDiscountedPrice(discountedPriceValue);
      }
    } else if (typeof originalPrice === 'string') {
      const originalPriceValue = parseFloat(originalPrice);
      if (!isNaN(originalPriceValue)) {
        setDiscountedPrice(originalPriceValue);
      }
    }
  }, [originalPrice, discount]);

  useEffect(() => {
    localStorage.setItem('currentQuantityValue', currentQuantityValue.toString());
  }, [currentQuantityValue]);


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
              control={productForm.control}
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
                        defaultValue={field.value}
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
                  control={productForm.control}
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
                            defaultValue={field.value === 0 ? '' : field.value}
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
                  control={productForm.control}
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
                            defaultValue={field.value === 0 ? '' : field.value}
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
                  control={productForm.control}
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
                            defaultValue={field.value === 0 ? '' : field.value}
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
                  control={productForm.control}
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
                            defaultValue={field.value === 0 ? '' : field.value}
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
                  control={productForm.control}
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
                            value={discountedPrice.toFixed(2)}
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

          <div className='w-full flex gap-6'>
            <div className='w-full flex flex-col gap-2'>
              <label>Original Quantity</label>
              <FormField
                  control={productForm.control}
                  name='originalQuantity'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='originalQuantity'
                            className='focus-visible:ring-[#63B38F]' 
                            placeholder='Original Quantity'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={(e) => {
                              field.onChange(e.target.value),
                              setCurrentQuantityValue(parseFloat(e.target.value))
                            }}
                            onBlur={field.onBlur}
                            defaultValue={field.value === 0 ? '' : field.value}
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
              <label>Current Quantity</label>
              <FormField
                  control={productForm.control}
                  name='currentQuantity'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='currentQuantity'
                            className='focus-visible:ring-[#63B38F] text-[#66fcb9]' 
                            placeholder='Current Quantity'
                            type='number'
                            ref={field.ref}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            value={currentQuantityValue}
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
                control={productForm.control}
                name='productStatus'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <select
                        name={field.name}
                        className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        value={productStatusValue}
                        onChange={(event) => setProductStatusValue(event.target.value)}
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
