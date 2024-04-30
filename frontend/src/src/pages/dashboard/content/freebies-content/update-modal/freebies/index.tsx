import React, { useEffect, useState } from 'react';
import { IoMdCloudDownload } from 'react-icons/io';
import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { UpdateFreebiesRequest } from '../../../../../../service/freebies/schema';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { useAtom } from 'jotai';
import { freebiesStatusUpdateAtom, storePriceInputValueAtom } from '../../../../../../atom/freebiesAtom';

interface Freebie {
  freebiesId: string;
  freebiesName: string;
  freebiesStorePrice: number;
  freebiesImg: string;
  freebiesStatus: string;
}

export const FreebiesModalUpdate = (props: Freebie) => {

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [, setStorePriceInputValue ] = useAtom(storePriceInputValueAtom);
  const [ freebiesStatusValue, setFreebiesStatusValue ] = useAtom(freebiesStatusUpdateAtom);

  useEffect(() => {
    setFreebiesStatusValue(props.freebiesStatus)
  },[props.freebiesStatus])
 
  const freebiesFormUpdate = useFormContext<UpdateFreebiesRequest>()
    // const { formState } = freebiesForm
    // const { isValid, isSubmitting } = formState
    // const shouldDisable = !isValid || isSubmitting

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Freebies Update:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>
     
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Freebies Name</label>
            <FormField
                control={freebiesFormUpdate.control}
                name='freebiesName'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='freebiesName'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Freebies Name'
                          type='text'
                          ref={field.ref}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          defaultValue={props.freebiesName}
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
            <label>Freebies Store Price</label>
            <FormField
                control={freebiesFormUpdate.control}
                name='freebiesStorePrice'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='freebiesStorePrice'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Freebies Store Price'
                          type='number'
                          ref={field.ref}
                          name={field.name}
                          onChange={(e) => {
                            field.onChange(e);
                            setStorePriceInputValue(e.target.value)
                          }}
                          onBlur={field.onBlur}
                          defaultValue={props.freebiesStorePrice}
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
            <label>Freebies Status</label>
            <FormField
                control={freebiesFormUpdate.control}
                name='freebiesStatus'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <select
                        name={field.name}
                        className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        value={freebiesStatusValue}
                        onChange={(event) => setFreebiesStatusValue(event.target.value)}
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
                        </select>
                        </FormControl>
                        <FormDescription className='text-red-500'>
                            {fieldState.error?.message}
                        </FormDescription>
                    </FormItem>
                )}
            />
          </div>
          <div className='w-[50%] flex flex-col gap-2'>
            <label>Freebies Image</label>
            <div className='flex flex-col gap-2 w-[100%]'>
              <label htmlFor='doc' className='flex items-center p-2 gap-3 rounded-3xl border border-[#63B38F] border-dashed cursor-pointer'>
                <IoMdCloudDownload className='w-10 h-10' />
                <div className='space-y-2'>
                  <h4 className='text-base font-semibold text-gray-50'>Upload a file</h4>
                  <span className='text-sm text-gray-400'>Max 2 MO</span>
                </div>
                <FormField
                  control={freebiesFormUpdate.control}
                  name='freebiesImg'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <Input 
                            id='doc'
                            className='focus-visible:ring-[#63B38F] hidden' 
                            type='file'
                            accept='png, jpg, jpeg'
                            ref={field.ref}
                            name={field.name}
                            onChange={(e) => {
                              // Call handleFileChange with the event and set field value to the selected file
                              handleFileChange(e);
                              // Check if e.target.files exists and has length > 0 before accessing the first file
                              if (e.target.files && e.target.files.length > 0) {
                                  field.onChange(e.target.files[0]);
                              }
                          }}
                            onBlur={field.onBlur}
                          />
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
                />
                {/* Display preview image if available */}
                <div className='w-full h-full flex flex-1 justify-center items-center'>
                  { previewImage ? (
                    <img src={previewImage} alt='Preview' className='w-24 h-24 ml-2 rounded-lg' />
                  ) : (
                    props.freebiesImg ? (
                      <img className='w-24 h-24 ml-2 rounded-lg' src={`data:image/jpeg;base64,${props.freebiesImg}`} alt={props.freebiesName} />
                    ) : null
                  )}
                </div>
              </label>
            </div>
          </div>    
        </div>
      </div>
    </div>
  );
}
