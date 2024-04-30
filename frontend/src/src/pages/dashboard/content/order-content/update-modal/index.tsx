import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { toast } from 'react-toastify';
import { UpdateOrderRequest, UpdateOrderResponse, updateOrderRequest } from '../../../../../service/order/schema';
import { useAtom } from 'jotai';
import { barangaySelectUpdate, citySelectUpdate, provinceSelectUpdate, regionSelectUpdate } from '../../../../../atom/checkOutAtom';
import { orderStatusAtom, productAddAtomUpdate } from '../../../../../atom/orderAtom';
import { updateOrder } from '../../../../../service/order';
import { useEffect, useState } from 'react';
import { AddAddressModalUpdate } from './address';
import { AddCustomerModalUpdate } from './customer';
import { AddProductModalUpdate } from './product';
import { AddTrackingStatusModalUpdate } from './statusTracking';
import { v4 as uuidv4 } from 'uuid';

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
}

export const UpdateOrderModalView = (props: Xprox) => {

  const orderId = props.orderId ? props.orderId : uuidv4();
  const [product, setProduct] = useAtom(productAddAtomUpdate);
  const [selectedRegion, setSelectedRegion] = useAtom(regionSelectUpdate);
  const [selectedProvince, setSelectedProvince] = useAtom(provinceSelectUpdate);
  const [selectedCity, setSelectedCity] = useAtom(citySelectUpdate);
  const [selectedBarangay, setSelectedBarangay] = useAtom(barangaySelectUpdate);
  const [ orderStatusValue, setOrderStatusValue ] = useAtom(orderStatusAtom);

  useEffect(() => {
    setSelectedRegion(props.region)
    setSelectedProvince(props.province)
    setSelectedCity(props.city)
    setSelectedBarangay(props.barangay)
    setProduct(props.product)
    setOrderStatusValue(props.orderStatus)
  },[props.region, props.province, props.city, props.barangay, props.product])

  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  const orderFormUpdate = useForm<UpdateOrderRequest>({
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
        trackingId: props.trackingId
    },
    mode: 'onChange',
    resolver: zodResolver(updateOrderRequest),
  });

  const { mutate: updateOrdderMu } = useMutation<
    UpdateOrderResponse,
    AxiosError,
    UpdateOrderRequest
  >((data) => updateOrder(data), {
    onSuccess: () => {
      setSelectedRegion('')
      setSelectedProvince('')
      setSelectedCity('')
      setSelectedBarangay('')
      setProduct([]);
      queryClient.invalidateQueries('pending-order-data');
      queryClient.invalidateQueries('active-order-data');
      queryClient.invalidateQueries('shipped-order-data');
      queryClient.invalidateQueries('delivered-order-data');
      queryClient.invalidateQueries('cancelled-order-data');
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleUpdateOrder = async (data: UpdateOrderRequest) => {

    const total = product.reduce((acc, item) => {
      return acc + (item.quantity * item.discountedPrice);
    }, 0);

    const params: UpdateOrderRequest = {
        orderId: orderId,
        customer: {
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          emailAddress: data.customer.emailAddress,
          contactNumber: data.customer.contactNumber
        },
        completeAddress:{
          address: data.completeAddress.address,
          barangay: selectedBarangay,
          city: selectedCity,
          houseNumber: data.completeAddress.houseNumber,
          landMark: data.completeAddress.landMark,
          province: selectedProvince,
          region: selectedRegion
        },
        product: product,
        total:total,
        orderStatus: orderStatusValue,
        trackingId: data.trackingId
    };
    updateOrdderMu(params);

  };

  const handleCloseAdd = () => {
      setSelectedRegion('')
      setSelectedProvince('')
      setSelectedCity('')
      setSelectedBarangay('')
      setProduct([]);
      setStepTwo(false);
      orderFormUpdate.reset();
      props.handleClose()
  }

  const [ stepTwo, setStepTwo ] = useState<boolean>(false)

  useEffect(() => {
    if ((
      (orderFormUpdate.getValues('completeAddress.address') !== props.address) ||
      (orderFormUpdate.getValues('completeAddress.houseNumber') !== props.houseNumber) ||
      (orderFormUpdate.getValues('completeAddress.landMark') !== props.landMark) ||
      (selectedRegion !== props.region) ||
      (selectedProvince !== props.province) ||
      (selectedCity !== props.city) ||
      (selectedBarangay !== props.barangay))
    ) {
      setStepTwo(true);
    }
  },[selectedRegion, selectedProvince, selectedCity, selectedBarangay, props.region, props.province, props.city, props.barangay])

  return (
    <Modal open={props.isVisible} onClose={handleCloseAdd}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={handleCloseAdd} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
            </button>
            <Form {...orderFormUpdate}>
              <form onSubmit={orderFormUpdate.handleSubmit(handleUpdateOrder)} className='mt-2 w-full h-full'>
              <Stepper
                    strokeColor='#17253975'
                    fillStroke='#172539'
                    activeColor='#172539'
                    activeProgressBorder='2px solid #17253975'
                    submitBtn={<button type='submit' className={`stepperBtn ${
                     
                      !stepTwo
                        ? 'opacity-55' 
                        : null
                    }`}
                    disabled={
                      
                      !stepTwo
                        ? true 
                        : false
                    }>Submit</button>}
                    continueBtn={
                      <button
                        type='button'
                        className={`stepperBtn`}
                      >
                        Next
                      </button>
                    }
                    backBtn={<button type='button' className='stepperBtn'>Back</button>}
                    >
                    <div className='stepperSubDiv'>
                        <AddCustomerModalUpdate firstName={props.firstName} lastName={props.lastName} emailAddress={props.emailAddress} contactNumber={props.contactNumber} />
                    </div>
                    <div className='stepperSubDiv'>
                        <AddAddressModalUpdate address={props.address} landMark={props.landMark} houseNumber={props.houseNumber} />
                    </div>
                    <div className='stepperSubDiv'>
                        <AddProductModalUpdate />
                    </div>
                    <div className='stepperSubDiv'>
                        <AddTrackingStatusModalUpdate trackingId={props.trackingId} />
                    </div>
                    </Stepper>
              </form>
            </Form>
      </div>
    </Modal>
  )
}

