import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { toast } from 'react-toastify';
import { SaveOrderRequest, SaveOrderResponse, saveOrderRequest } from '../../../../../service/order/schema';
import { AddCustomerModal } from './customer';
import { AddAddressModal } from './address';
import { useAtom } from 'jotai';
import { regionSelect, provinceSelect, citySelect, barangaySelect } from '../../../../../atom/checkOutAtom';
import { AddProductModal } from './product';
import { productAddAtom } from '../../../../../atom/orderAtom';
import { saveOrder } from '../../../../../service/order';
import { useEffect, useState } from 'react';
import { sendEmail } from '../../../../../service/email-sending';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
}

export const AddOrderModalView = (props: Xprox) => {

  const [product, setProduct] = useAtom(productAddAtom);
  const [selectedRegion, setSelectedRegion] = useAtom(regionSelect);
  const [selectedProvince, setSelectedProvince] = useAtom(provinceSelect);
  const [selectedCity, setSelectedCity] = useAtom(citySelect);
  const [selectedBarangay, setSelectedBarangay] = useAtom(barangaySelect);

  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully added!");

  const orderForm = useForm<SaveOrderRequest>({
    defaultValues: {
        customer: {
            firstName:'',
            lastName:'',
            emailAddress:'',
            contactNumber:''
        },
        completeAddress: {
            address:'',
            houseNumber: '',
            landMark: '',
            region: '',
            province: '',
            city: '',
            barangay: ''
        },
        product:[
          {
            productId:'',
            productName:'',
            discountedPrice:0,
            quantity:0,
            freebies:''
          }
        ],
        total:0,
        orderStatus: '',
    },
    mode: 'onChange',
    resolver: zodResolver(saveOrderRequest),
  });

  const { mutate: saveOrderMu } = useMutation<
    SaveOrderResponse,
    AxiosError,
    SaveOrderRequest
  >((data) => saveOrder(data), {
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

  const handleSaveOrder = async (data: SaveOrderRequest) => {

    const total = product.reduce((acc, item) => {
      return acc + (item.quantity * item.discountedPrice);
    }, 0);

    const params: SaveOrderRequest = {
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
        orderStatus: "ACT"
    };


    // Construct email body
    const emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                 @font-face {
                    font-family: 'Perpetua Regular';
                    src: url('path/to/perpetua-regular.ttf') format('truetype'); /* Adjust the path and format */
                    /* You can also provide additional font formats (woff, woff2, etc.) for better cross-browser compatibility */
                }
        
                body {
                    margin: 0 auto;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    height:100%;
                    width: 100%;
                }
                .holder1{
                    margin: 0 auto;
                    padding: 0;
                    height:100%;
                    width: 100%;
                    background-color: white ;
                }
                .holder2{
                    margin: 0 auto;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    padding-top: 40px;
                    padding-bottom: 40px;
                    background-color: #F3F4F8;
                }
                .headerHolder{
                    margin: 0 auto;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    align-items: center;
                    padding-bottom: 10px;
                }
                .header {
                    width: 60%;
                    height: 100%;
                }
                .body {
                    text-align: start;
                    margin:0 auto;
                    padding:0;
                    padding: 21px;
                    background-color:white;
                    width: 51%;
                    overflow: auto;
                }
                p{
                    color:rgb(20, 20, 20);
                    letter-spacing: 0.1em;
                }
                span{
                    color:black;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                }
                strong{
                    color:black;
                    letter-spacing: 0.1em;
                }

                @media (max-width: 768px) {
                    /* Adjust the width for mobile devices */
                    .body {
                        width: 90%;
                        background-color: #F3F4F8;     
                    } 
                }
            </style>
        </head>
        <body>
        <div class="holder">
            <div class="holder2">
                <div class="body">
                    <div class="headerHolder">
                    <img class="header" src="https://chronex-bucket.s3.ap-southeast-1.amazonaws.com/CHRONEX-LOGO-bg.png" alt="Chronex Logo" />
                    </div>
                    <strong>Hello ${data.customer.firstName},</strong>
                    <p>
                        Thank you for shopping with us! We're excited to confirm that your order has been received and is now being processed.
                    </p>
                    <hr>
                    <p>Order Details:</p>
                    <ul>
                        ${product.map(product => `<li>${product.productName} - <strong>(${product.quantity})</strong></li>`).join('')}
                    </ul>\n
                    <p>Total: ₱${total.toFixed(2)}</p>
                    <hr>
                    <p>Shipping Address:</p>
                    <p><strong>Address:</strong> ${data.completeAddress.address}</p>
                    <p><strong>Barangay:</strong> ${selectedBarangay}</p>
                    <p><strong>City:</strong> ${selectedCity}</p>
                    <p><strong>House Number:</strong> ${data.completeAddress.houseNumber}</p>
                    <p><strong>Landmark:</strong> ${data.completeAddress.landMark}</p>
                    <p><strong>Province:</strong> ${selectedProvince}</p>
                    <p><strong>Region:</strong> ${selectedRegion}</p>
                    <hr>
                    <p>If you have any questions or concerns about your order, feel free to reply to this email or contact our customer service team at this contact number: 091124442234.</p>
                    <p>Thank you for choosing us!</p>
                </div>
            </div>
        </div>
        </body>
        </html>
      `;


    saveOrderMu(params);
    sendEmail(data.customer.emailAddress, "Order Confirmation", emailBody);
  };

  const handleCloseAdd = () => {
      setSelectedRegion('')
      setSelectedProvince('')
      setSelectedCity('')
      setSelectedBarangay('')
      setProduct([]);
      setStepTwo(false);
      orderForm.reset();
      props.handleClose()
  }

  const [ stepTwo, setStepTwo ] = useState<boolean>(false)

  useEffect(() => {
    if ((
      (orderForm.getValues('completeAddress.address') !== '') &&
      (orderForm.getValues('completeAddress.houseNumber') !== '') &&
      (orderForm.getValues('completeAddress.landMark') !== '') &&
      (selectedRegion !== '') &&
      (selectedProvince !== '') &&
      (selectedCity !== '') &&
      (selectedBarangay !== ''))
    ) {
      setStepTwo(true);
    }
  },[selectedRegion, selectedProvince, selectedCity, selectedBarangay])

  return (
    <Modal open={props.isVisible} onClose={handleCloseAdd}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={handleCloseAdd} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
            </button>
            <Form {...orderForm}>
              <form onSubmit={orderForm.handleSubmit(handleSaveOrder)} className='mt-2 w-full h-full'>
              <Stepper
                    strokeColor='#17253975'
                    fillStroke='#172539'
                    activeColor='#172539'
                    activeProgressBorder='2px solid #17253975'
                    submitBtn={<button type='submit' className={`stepperBtn ${
                      (orderForm.getValues('customer.firstName') === '') ||
                      (orderForm.getValues('customer.lastName') === '') ||
                      (orderForm.getValues('customer.emailAddress') === '') ||
                      (orderForm.getValues('customer.contactNumber') === '') ||
                      !stepTwo ||
                      product.length === 0
                        ? 'opacity-55' 
                        : null
                    }`}
                    disabled={
                      (orderForm.getValues('customer.firstName') === '') ||
                      (orderForm.getValues('customer.lastName') === '') ||
                      (orderForm.getValues('customer.emailAddress') === '') ||
                      (orderForm.getValues('customer.contactNumber') === '') ||
                      !stepTwo ||
                      product.length === 0
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
                    onPrev={(step) => {
                      if (step === 1) {
                        setSelectedRegion('')
                        setSelectedProvince('')
                        setSelectedCity('')
                        setSelectedBarangay('')
                        setProduct([]);
                        setStepTwo(false);
                      }
                    }} 
                    >
                    <div className='stepperSubDiv'>
                        <AddCustomerModal />
                    </div>
                    <div className='stepperSubDiv'>
                        <AddAddressModal />
                    </div>
                    <div className='stepperSubDiv'>
                        <AddProductModal />
                    </div>
                    </Stepper>
              </form>
            </Form>
      </div>
    </Modal>
  )
}

