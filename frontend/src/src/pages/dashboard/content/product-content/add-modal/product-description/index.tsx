import { Input } from '../../../../../../components/input';
import { IoIosAdd, IoMdClose } from 'react-icons/io';
import { FormField, FormItem, FormControl, FormDescription } from '../../../../../../components/ui/form';
import { useFormContext } from 'react-hook-form';
import { SaveProductRequest } from '../../../../../../service/product-service/schema';
import { useAtom } from 'jotai';
import { productDescription2Atom } from '../../../../../../atom/productDetailsAtom';

export const ProductDescription = () => {
  const productForm = useFormContext<SaveProductRequest>()
  const [bulletDescriptions, setBulletDescriptions] = useAtom(productDescription2Atom);

  const handleAddBulletDescription = () => {
    const inputElement = document.getElementById('description2') as HTMLInputElement;
    if (inputElement) {
      const inputValue = inputElement.value;
      setBulletDescriptions(prevDescriptions => [...prevDescriptions, inputValue]);
      inputElement.value = '';
    }
  };

  const handleRemoveBulletDescription = (indexToRemove: number) => {
    setBulletDescriptions(prevDescriptions =>
      prevDescriptions.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Description:</h1>
      </div>
      <div className='mt-6 row flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
            <label>Main Description</label>
            <FormField
              control={productForm.control}
              name='description1'
              render={({ field, fieldState }) => (
                  <FormItem className='col-span-full'>
                      <FormControl>
                      <textarea 
                        id='description1'
                        className='focus-visible:ring-[#63B38F] w-[100%] px-5 py-2 min-h-[20dvh]' 
                        placeholder='Type Here...'
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
          <div className='flex flex-col gap-2'>
            <label>Bullet Description</label>
            <div className='w-full flex gap-4'>
              <div className='w-full flex flex-1 gap-2'>
                <FormField
                control={productForm.control}
                name='description2'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full w-[80%]'>
                        <FormControl>
                        <Input 
                          id='description2'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Type here..'
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
                <button 
                  type='button'
                  className='w-10 h-10 border border-[#63B38F] rounded-md flex justify-center items-center cursor-pointer hover:bg-[#bdfce0]'
                  onClick={handleAddBulletDescription}
                >
                  <IoIosAdd className='w-6 h-6' />
                </button>
              </div>
              <div id='displayedDescription' className='flex flex-1 bg-[#172539] border border-[#63B38F] min-h-[20dvh] shadow-inner shadow-[#63B38F] px-4 py-4'>
                {/* Display added bullet descriptions */}
                <ul className='relative'>
                  {bulletDescriptions.map((description, index) => (
                    <li key={index}>
                      <span>&#8226;</span> {description}
                      <button
                        type='button'
                        className='ml-4 text-red-600 absolute'
                        onClick={() => handleRemoveBulletDescription(index)}
                      >
                        <IoMdClose className='w-6 h-6' />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
