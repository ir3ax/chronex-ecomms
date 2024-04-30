
import { IoIosClose } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../../../../components/input';
import { FormField, FormItem, FormControl, FormDescription, Form } from '../../../../../components/ui/form';
import { UpdateOrderRequest, UpdateOrderResponse, updateOrderRequest } from '../../../../../service/order/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { updateOrder } from '../../../../../service/order';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { stickyNotesAtom } from '../../../../../atom/orderAtom';
import { useEffect, useState } from 'react';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    orderId: string;
    firstName: string,
    lastName: string,
    emailAddress: string,
    contactNumber: string,
    address: string,
    barangay: string,
    city: string,
    houseNumber: string,
    landMark: string,
    province: string,
    region: string,
    product: Array<{
        productId: string,
        productName: string,
        discountedPrice: number,
        quantity: number,
        freebies: string
    }>,
    total:number,
    orderStatus:string,
    trackingId: string,
    stickyNotes: string
}

export const StickyNotes = (props: Xprox) => {

    const orderId = props.orderId ? props.orderId : uuidv4();
    const notify = () => toast.success("Notes updated!");
    const queryClient = useQueryClient();

    const [stickyNotesAtomValue, setStickyNotesAtomValue ] = useAtom(stickyNotesAtom);
    const [propsStickyNotes2, setPropsStickyNotes2] = useState<string[]>([]);

    useEffect(() => {
        if (props.stickyNotes) {
            const cleanedNotes = props.stickyNotes
                .replace(/\\/g, '')   
                .replace(/"/g, '')     
                .replace(/\[/g, '')    
                .replace(/\]/g, '')   
                .split(',')
                .map(note => note.trim())
                .filter(note => note !== '');
            setPropsStickyNotes2(cleanedNotes);
        }
    }, [props.stickyNotes, props.handleClose]);
   
    const handleAddStickyNotes = () => {
        const inputElement = document.getElementById('stickyNotes') as HTMLInputElement;
        if (inputElement) {
          const inputValue = inputElement.value;
          setStickyNotesAtomValue(prevDescriptions => [...prevDescriptions, inputValue]);
          inputElement.value = '';
        }
      };
    
      const handleRemoveStickyNotesCurrent = (indexToRemove: number) => {
        setStickyNotesAtomValue(prevDescriptions =>
          prevDescriptions.filter((_, index) => index !== indexToRemove)
        );
      };
    
      const handleRemoveStickyNotes = (index: number) => {
        const newPropsSticky = propsStickyNotes2.filter((_, i) => i !== index);
        setPropsStickyNotes2(newPropsSticky);
      };
    
    const orderFormUpdateStickyNotes = useForm<UpdateOrderRequest>({
        defaultValues: {
            orderId:orderId,
            customer: {
                firstName:props.firstName,
                lastName:props.lastName,
                emailAddress:props.emailAddress,
                contactNumber:props.contactNumber
            },
            completeAddress: {
                address:props.address,
                houseNumber: props.houseNumber,
                landMark: props.landMark,
                region: props.region,
                province: props.province,
                city: props.city,
                barangay: props.barangay
            },
            product:props.product,
            total:props.total,
            orderStatus: props.orderStatus,
            trackingId: props.trackingId,
            stickyNotes:props.stickyNotes
        },
        mode: 'onChange',
        resolver: zodResolver(updateOrderRequest),
    });

    const { mutate: updateOrderMu } = useMutation<
    UpdateOrderResponse,
    AxiosError,
    UpdateOrderRequest
  >((data) => updateOrder(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('pending-order-data');
      setStickyNotesAtomValue([]);
      setPropsStickyNotes2([]);
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleUpdateOrder = async () => {

    const combineStickNotes = [...propsStickyNotes2.flat(), ...stickyNotesAtomValue];
    const stickyNotesJson = JSON.stringify(combineStickNotes).trim();

    const params: UpdateOrderRequest = {
        orderId: orderId,
        customer: {
            firstName:props.firstName,
            lastName:props.lastName,
            emailAddress:props.emailAddress,
            contactNumber:props.contactNumber
        },
        completeAddress: {
            address:props.address,
            houseNumber: props.houseNumber,
            landMark: props.landMark,
            region: props.region,
            province: props.province,
            city: props.city,
            barangay: props.barangay
        },
        product:props.product,
        total:props.total,
        orderStatus: props.orderStatus,
        trackingId: props.trackingId,
        stickyNotes: stickyNotesJson
        };
        updateOrderMu(params)
    };

    const handleCloseSticky = () => {
        setStickyNotesAtomValue([]);
        setPropsStickyNotes2([]);
        props.handleClose()
    }

    return (
        <div className={`sticky-notes ${props.isVisible ? 'slide-in' : 'slide-out'} h-full min-h-[100dvh] border bg-[#f7f7f7] w-96 absolute right-0 top-[72px] z-50 flex flex-col shadow-2xl`}>
            <button onClick={handleCloseSticky} className='flex justify-end items-start w-full mr-2 mt-4'>
                <IoIosClose className='w-8 h-8 text-[#808080] cursor-pointer' />
            </button>
            <Form {...orderFormUpdateStickyNotes}>
            <form onSubmit={orderFormUpdateStickyNotes.handleSubmit(handleUpdateOrder)} className='w-full h-full p-4 pr-6 pl-6'>
                <div className='w-[100%] flex flex-col gap-2'>
                            <FormField
                                control={orderFormUpdateStickyNotes.control}
                                name='stickyNotes'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full'>
                                        <FormControl>
                                            <Input 
                                                id='stickyNotes'
                                                className='focus-visible:ring-[#63B38F] h-12' 
                                                placeholder='Type notes...'
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
                            <div className='w-full flex justify-end items-end mb-4'>
                                <button type="button" onClick={handleAddStickyNotes} className='flex justify-center items-center gap-2 pl-4 pr-4 h-[40px] rounded-md border text-md bg-[#172539] text-white font-normal hover:bg-gray-500 text-sm'>Add notes</button>
                            </div>
                        <hr className='border-[#172539]'/>
                        <div className='w-full p-4 pr-6 pl-6 flex flex-col gap-4 min-h-60'>
                            {propsStickyNotes2 && (
                                <>
                                    {propsStickyNotes2.map((notes: string, index: number) => (
                                        <div className='border p-4 pr-6 pl-6 border-black flex justify-start items-center gap-4 rounded-md' key={index}>
                                            <span className='w-[90%] flex text-sm'>{notes}</span>
                                            <span className='mt-1 w-[10%] flex justify-end items-end'>
                                                <IoIosClose onClick={() => handleRemoveStickyNotes(index)} className='w-6 h-6 text-[#852323] cursor-pointer' />
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {stickyNotesAtomValue.map((notes, index) => (
                                <div className='border p-4 pr-6 pl-6 border-black flex justify-start items-center gap-4 rounded-md' key={index}>
                                    <span className='w-[90%] flex text-sm'>{notes}</span>
                                    <span className='mt-1 w-[10%] flex justify-end items-end'>
                                        <IoIosClose onClick={() => handleRemoveStickyNotesCurrent(index)} className='w-6 h-6 text-[#852323] cursor-pointer' />
                                    </span>
                                </div>
                            ))}
                            {/* {
                                propsStickyNotes2.length > 0 || stickyNotesAtomValue.length > 0 ? 
                                <div className='w-full flex justify-end items-end pt-4'>
                                    <button type="submit" className='flex justify-center items-center gap-2 pl-4 pr-4 h-[40px] rounded-md border text-md bg-[#172539] text-white font-normal hover:bg-gray-500 text-sm'>Save</button>
                                </div>
                                :
                                null
                            } */}
                    </div>
                    <hr className='border-[#172539]'/>
                    <div className='w-full flex justify-end items-end pt-4'>
                        <button type="submit" className='flex justify-center items-center gap-2 pl-9 pr-9 h-[40px] rounded-md border text-md bg-[#172539] text-white font-normal hover:bg-gray-500 text-sm'>Save</button>
                    </div>
                </div>
            </form>
            </Form>
        </div>
    );
    
}

