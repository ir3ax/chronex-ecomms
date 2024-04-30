import { PiListMagnifyingGlassLight } from "react-icons/pi"
import { NoData } from "../../../../no-data"
import { CustomerModalView } from "../customer-profile";
import { useState } from "react";
import { AddressModalView } from "../address-profile";
import { ProductModalView } from "../product-profile";
import { useQuery } from "react-query";
import { getAllOrder } from "../../../../../service/order";
import { UpdateOrderModalView } from "../update-modal";
import { BiSolidEdit, BiSolidMessageRoundedEdit } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { ModalViewDeleteOrder } from "../delete-modal";
import { SiMinutemailer } from "react-icons/si";
import { ModalSendingEmail } from "../sending-email";
import { StickyNotes } from "../sticky-notes";
import { FaExclamation } from "react-icons/fa6";

interface Product {
    productId: string;
    productName: string;
    quantity: number;
    discountedPrice: number;
    freebies: string;
}

interface SortProps {
    sortOption: string;
    search: string;
}

export const ActiveTable = (props: SortProps) => {
    
    const [ openViewCustomer, setOpenViewCustomer ] = useState<boolean>(false);
    const [ openViewAddress, setOpenViewAddress ] = useState<boolean>(false);
    const [ openViewProduct, setOpenViewProduct ] = useState<boolean>(false);

    const [ updateOpenView, setUpdateOpenView ] = useState<boolean>(false);

    const { data: orderData } = useQuery(
        ['active-order-data', props.sortOption, props.search, "ACT"],
        () => getAllOrder(props.sortOption || 'ATOZ', props.search, "ACT"),
    );

    const handleCloseViewCustomer = () => {
        setOpenViewCustomer(false);
    }

    const handleCloseViewAddress = () => {
        setOpenViewAddress(false);
    }

    const handleCloseViewProduct = () => {
        setOpenViewProduct(false);
    }

    const handleCloseViewUpdate = () => {
        setUpdateOpenView(false);
    }

    const [customerState, setCustomerState] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        contactNumber: ""
    });

    const handleCustomer = (firstName: string, lastName: string, emailAddress: string, contactNumber: string) => {
        const customerValues = {
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            contactNumber: contactNumber
        };

        setCustomerState(customerValues);
        setOpenViewCustomer(true);
    }

    const [addressState, setAddressState] = useState({
        address: "",
        barangay: "",
        city: "",
        houseNumber: "",
        landMark: "",
        province: "",
        region: ""
    });

    const handleAddress = (address: string, barangay: string, city: string, houseNumber: string, landMark: string, province: string, region: string) => {
        const addressValues = {
            address: address,
            barangay: barangay,
            city: city,
            houseNumber: houseNumber,
            landMark: landMark,
            province: province,
            region: region
        };

        setAddressState(addressValues);
        setOpenViewAddress(true);
    }

    const [productState, setProductState] = useState<Product[]>([]);

    const handleProduct = (productArray: Product[]) => {
        if (productArray.length > 0) {
            setProductState(productArray);
            setOpenViewProduct(true);
        }
    }; 

    const [updateOrderState, setUpdateOrderState ] = useState({
        orderId:"",
        customer:{
            firstName:"",
            lastName:"",
            emailAddress:"",
            contactNumber:"",
        },
        completeAddress:{
            address: "",
            barangay: "",
            city: "",
            houseNumber: "",
            landMark: "",
            province: "",
            region: ""
        },
        product:[
            {
                productId:"",
                productName:"",
                discountedPrice:0,
                quantity:0,
                freebies:""

            }
        ],
        total:0,
        orderStatus:"",
        trackingId:""
    })

    const handleUpdateOrder = (
        orderId: string,
        firstName: string,
        lastName: string,
        emailAddress: string,
        contactNumber: string,
        address: string,
        barangay: string,
        city: string,
        houseNumber: string,
        landmark: string,
        province: string,
        region: string,
        product: Array<{
            productId: string,
            productName: string,
            discountedPrice: number,
            quantity: number,
            freebies: string
        }>,
        total: number,
        orderStatus: string,
        trackingId: string
    ) => {
        const orderValues = {
            orderId: orderId,
            customer: {
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                contactNumber: contactNumber
            },
            completeAddress: {
                address: address,
                barangay: barangay,
                city: city,
                houseNumber: houseNumber,
                landMark: landmark,
                province: province,
                region: region
            },
            product: product,
            total: total,
            orderStatus: orderStatus,
            trackingId: trackingId
        };
    
        setUpdateOrderState(orderValues);
        setUpdateOpenView(true);
    }

    //Delete Order
    const [openViewDeleteOrder, setOpenViewDeleteOrder] = useState<boolean>(false);

    const handleCloseViewDeleteOrder = () => {
        setOpenViewDeleteOrder(false);
    };
     const [orderStateDelete, setOrderStateDelete] = useState({
        orderId: "",
        orderStatus: "",
    });

    const handleModalDeleteOrder = (orderId: string, orderStatus: string) => {
        const deletedValues = {
            orderId: orderId,
            orderStatus: orderStatus,
        };
    
        setOrderStateDelete(deletedValues);
    
        setOpenViewDeleteOrder(true);
    }

    //Send Emmail
    const [openViewSendingEmail, setOpenViewSendingEmail] = useState<boolean>(false);

    const handleCloseViewSendingEmail = () => {
        setOpenViewSendingEmail(false);
    };
     const [orderStateSendingEmail, setOrderStateSendingEmail] = useState({
        email: "",
        firstName: "",
    });

    const handleModalSendingEmail = (email: string, firstName: string) => {
        const sendingValues = {
            email: email,
            firstName: firstName,
        };
    
        setOrderStateSendingEmail(sendingValues);
    
        setOpenViewSendingEmail(true);
    }

    //Sticky Notes
    const [ stickyNotesOpenView, setStickyNotesOpenView ] = useState<boolean>(false);

    const handleCloseViewStickyNotes = () => {
        setStickyNotesOpenView(false);
    }

     const [orderStateStickyNotes, setOrderStateStickyNotes] = useState({
        orderId:"",
        customer:{
            firstName:"",
            lastName:"",
            emailAddress:"",
            contactNumber:"",
        },
        completeAddress:{
            address: "",
            barangay: "",
            city: "",
            houseNumber: "",
            landMark: "",
            province: "",
            region: ""
        },
        product:[
            {
                productId:"",
                productName:"",
                discountedPrice:0,
                quantity:0,
                freebies:"",
            }
        ],
        total:0,
        orderStatus:"",
        trackingId:"",
        stickyNotes:""
    });

    const handleModalStickyNotes = (
        orderId: string,
        firstName: string,
        lastName: string,
        emailAddress: string,
        contactNumber: string,
        address: string,
        barangay: string,
        city: string,
        houseNumber: string,
        landmark: string,
        province: string,
        region: string,
        product: Array<{
            productId: string,
            productName: string,
            discountedPrice: number,
            quantity: number,
            freebies: string
        }>,
        total: number,
        orderStatus: string,
        trackingId: string,
        stickyNotes: string
    ) => {
        const stickyNotesValues = {
            orderId: orderId,
            customer: {
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                contactNumber: contactNumber
            },
            completeAddress: {
                address: address,
                barangay: barangay,
                city: city,
                houseNumber: houseNumber,
                landMark: landmark,
                province: province,
                region: region
            },
            product: product,
            total: total,
            orderStatus: orderStatus,
            trackingId: trackingId,
            stickyNotes: stickyNotes
        };
    
        setOrderStateStickyNotes(stickyNotesValues);
    
        setStickyNotesOpenView(true);
    }
    
    return(
        <div className='table-container'>
        <CustomerModalView firstName={customerState.firstName} lastName={customerState.lastName} emailAddress={customerState.emailAddress} contactNumber={customerState.contactNumber} isVisible={openViewCustomer} handleClose={handleCloseViewCustomer} />
        <AddressModalView address={addressState.address} barangay={addressState.barangay} city={addressState.city} houseNumber={addressState.houseNumber} landMark={addressState.landMark} province={addressState.province} region={addressState.region} isVisible={openViewAddress} handleClose={handleCloseViewAddress} />
        <ProductModalView product={productState} isVisible={openViewProduct} handleClose={handleCloseViewProduct} />
        <UpdateOrderModalView 
        orderId={updateOrderState.orderId}
        firstName={updateOrderState.customer.firstName}
        lastName={updateOrderState.customer.lastName}
        emailAddress={updateOrderState.customer.emailAddress}
        contactNumber={updateOrderState.customer.contactNumber}
        address={updateOrderState.completeAddress.address}
        barangay={updateOrderState.completeAddress.barangay}
        city={updateOrderState.completeAddress.city}
        houseNumber={updateOrderState.completeAddress.houseNumber}
        landMark={updateOrderState.completeAddress.landMark}
        province={updateOrderState.completeAddress.province}
        region={updateOrderState.completeAddress.region}
        product={updateOrderState.product}
        total={updateOrderState.total}
        orderStatus={updateOrderState.orderStatus}
        trackingId={updateOrderState.trackingId}
         isVisible={updateOpenView} handleClose={handleCloseViewUpdate} />
        <ModalViewDeleteOrder isVisible={openViewDeleteOrder} handleClose={handleCloseViewDeleteOrder} orderId={orderStateDelete.orderId} orderStatus={orderStateDelete.orderStatus} />
        <ModalSendingEmail isVisible={openViewSendingEmail} handleClose={handleCloseViewSendingEmail} email={orderStateSendingEmail.email} firstName={orderStateSendingEmail.firstName} />
        <StickyNotes 
        orderId={orderStateStickyNotes.orderId}
        firstName={orderStateStickyNotes.customer.firstName}
        lastName={orderStateStickyNotes.customer.lastName}
        emailAddress={orderStateStickyNotes.customer.emailAddress}
        contactNumber={orderStateStickyNotes.customer.contactNumber}
        address={orderStateStickyNotes.completeAddress.address}
        barangay={orderStateStickyNotes.completeAddress.barangay}
        city={orderStateStickyNotes.completeAddress.city}
        houseNumber={orderStateStickyNotes.completeAddress.houseNumber}
        landMark={orderStateStickyNotes.completeAddress.landMark}
        province={orderStateStickyNotes.completeAddress.province}
        region={orderStateStickyNotes.completeAddress.region}
        product={orderStateStickyNotes.product}
        total={orderStateStickyNotes.total}
        orderStatus={orderStateStickyNotes.orderStatus}
        trackingId={orderStateStickyNotes.trackingId}
        stickyNotes={orderStateStickyNotes.stickyNotes} 
        isVisible={stickyNotesOpenView} handleClose={handleCloseViewStickyNotes} />
        <table className='w-full text-sm text-left rtl:text-right text-gray-400'>
            <thead className='sticky top-0 z-10 text-xs uppercase bg-gray-700 text-gray-400'>
            {orderData?.orderData ? (
                <tr className='text-center'>
                    <th className='px-6 py-3 border-r border-gray-400'></th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        ID
                    </th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        Customer Info
                    </th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        Complete Address
                    </th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        Product Info
                    </th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        Total
                    </th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        Tracking No.
                    </th>
                    <th scope='col' className='px-6 py-3 border-r border-gray-400'>
                        Action
                    </th>
                </tr>
                    ) : (
                    null
                )}
            </thead>
            <tbody className='text-center pb-24'>
            {orderData?.orderData ? (
                orderData?.orderData.map((item, index) => {
                    // Parse customer object from JSON string
                    const customer = item.customer.toString();
                    const customerObject = JSON.parse(customer);
                    const fullName = `${customerObject.firstName} ${customerObject.lastName}`;

                    // Parse completeAddress object from JSON string
                    const address = item.completeAddress.toString();
                    const addressObject = JSON.parse(address);

                    // Parse completeAddress object from JSON string
                    const product = item.product.toString();
                    const productObject = JSON.parse(product);

                return(
                <tr key={index} className='bg-gray-900 even:bg-gray-800 border-b border-gray-700'>
                    <td className='relative px-6 py-4 border-r border-gray-600 flex gap-4'>
                        {index+1}
                        <button onClick={() => handleModalStickyNotes(
                            item.orderId,
                            customerObject.firstName,
                            customerObject.lastName,
                            customerObject.emailAddress,
                            customerObject.contactNumber,
                            addressObject.address,
                            addressObject.barangay,
                            addressObject.city,
                            addressObject.houseNumber,
                            addressObject.landMark,
                            addressObject.province,
                            addressObject.region,
                            productObject,
                            item.total,
                            item.orderStatus,
                            item.trackingId,
                            item.stickyNotes
                        )} className='absolute -right-1 -top-2 hover:text-white' type='button'>
                            <BiSolidMessageRoundedEdit  className='w-7 h-7' />
                            {item.stickyNotes &&
                            item.stickyNotes.replace(/\\/g, '')   
                            .replace(/"/g, '')     
                            .replace(/\[/g, '')    
                            .replace(/\]/g, '') ?
                                <div className='rounded-full w-3 h-3 bg-red-500 absolute -right-[2px] top-0 z-30 flex justify-center items-center'>
                                    <FaExclamation className='w-2 h-2 text-white' />
                                </div>
                            :
                                null
                            }
                        </button>
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600  font-medium text-white whitespace-nowrap ...'>
                        {item.orderId}
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                        <div className='flex gap-2 w-full h-full'>
                            <span className='flex flex-1 justify-start items-start'>
                                {fullName}
                            </span>
                            <button onClick={() => handleCustomer(customerObject.firstName, customerObject.lastName, customerObject.emailAddress, customerObject.contactNumber)} type='button' className='flex flex-1 justify-end items-end ml-4 hover:text-[#70CE98]'>
                                <PiListMagnifyingGlassLight className='w-6 h-6' />
                            </button>
                        </div>
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                        <div className='flex gap-2 w-full h-full'>
                            <span className='flex flex-1 justify-start items-start'>
                                {addressObject.address}
                            </span>
                            <button onClick={() => handleAddress(addressObject.address, addressObject.barangay, addressObject.city, addressObject.houseNumber, addressObject.landMark, addressObject.province, addressObject.region)} type='button' className='flex flex-1 justify-end items-end ml-4 hover:text-[#70CE98]'>
                                <PiListMagnifyingGlassLight className='w-6 h-6' />
                            </button>
                        </div>
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                        <div className='flex gap-2 w-full h-full'>
                            {productObject && productObject.map((productItem: { productName: string; quantity: number }, i: number) => (
                                <span className='flex flex-1 justify-start items-start' key={i}>
                                    {productItem.productName} 
                                    <span className='text-orange-500 ml-1'>({productItem.quantity})</span>
                                    {i !== item.product.length - 1 && ', '}
                                </span>
                            ))}
                            <button onClick={() => handleProduct(productObject)} type='button' className='flex flex-1 justify-end items-end ml-4 hover:text-[#70CE98]'>
                                <PiListMagnifyingGlassLight className='w-6 h-6' />
                            </button>
                        </div>
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                        {item.total.toFixed(2)}
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600  whitespace-nowrap ...'>
                        {item.trackingId}
                    </td>
                    <td className='px-6 py-4 border-r border-gray-600 flex justify-center items-center'>
                        <button onClick={() => handleModalSendingEmail(customerObject.emailAddress, customerObject.firstName)} className='font-medium text-purple-600 dark:text-purple-500 hover:text-purple-400 cursor-pointer mr-4'>
                            <SiMinutemailer  className='w-7 h-7' />
                        </button>
                        <button onClick={() => handleUpdateOrder(
                            item.orderId,
                            customerObject.firstName,
                            customerObject.lastName,
                            customerObject.emailAddress,
                            customerObject.contactNumber,
                            addressObject.address,
                            addressObject.barangay,
                            addressObject.city,
                            addressObject.houseNumber,
                            addressObject.landMark,
                            addressObject.province,
                            addressObject.region,
                            productObject,
                            item.total,
                            item.orderStatus,
                            item.trackingId
                            )} type='button' className='font-medium text-blue-600 dark:text-blue-500 hover:text-blue-400 cursor-pointer mr-4'>
                            <BiSolidEdit className='w-8 h-7' />
                        </button>
                        <button onClick={() => handleModalDeleteOrder(item.orderId, item.orderStatus)} className='font-medium text-red-600 dark:text-red-500 hover:text-red-400 cursor-pointer'>
                            <BsFillTrashFill className='w-6 h-6' />
                        </button>
                    </td>
                </tr>
                )
                })
            ) : (
                <div className='col-span-6 row-span-10 text-center flex justify-center items-center w-full h-full'>
                    <NoData /> 
                </div>
            )}
            </tbody>
        </table>
    </div>
    )
}