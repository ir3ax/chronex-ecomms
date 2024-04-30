
import Footer from '../../components/appLayout/footer';
import { TopBar } from '../../components/appLayout/topbar';
import { Input } from '../../components/input';
import { places } from '../../utility/places';
import { useAtom } from 'jotai';
import StarRatings from 'react-star-ratings';
import { barangaySelect, checkOutAtom, citySelect, provinceSelect, regionSelect } from '../../atom/checkOutAtom';
import { CompleteProductInfo } from '../../service/checkout/schema';
import { useNavigate } from 'react-router-dom';
import NoImage from '../../assets/utilities/no-image.png';
import { FormField, FormItem, FormControl, FormDescription, Form } from '../../components/ui/form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { saveOrderPublic } from '../../service/order';
import { SaveOrderRequestPublic, SaveOrderResponsePublic, saveOrderRequestPublic } from '../../service/order/schema';
import { sendEmail } from '../../service/email-sending';

const CheckOut = () => {

    const [selectedRegion, setSelectedRegion] = useAtom(regionSelect);
    const [selectedProvince, setSelectedProvince] = useAtom(provinceSelect);
    const [selectedCity, setSelectedCity] = useAtom(citySelect);
    const [selectedBarangay, setSelectedBarangay] = useAtom(barangaySelect);
    const [checkOutAtomValue, ] = useAtom(checkOutAtom);
    // const [, setCompleteCheckOutAtomValue] = useAtom(completeCheckOut);
    const navigate = useNavigate();

    const total = checkOutAtomValue.reduce((acc, product) => acc + (product.total || 0), 0);

    const queryClient = useQueryClient();
    const notify = () => toast.success("Successfully added!");

    const orderFormPublic = useForm<SaveOrderRequestPublic>({
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
        resolver: zodResolver(saveOrderRequestPublic),
    });

    const { mutate: saveOrderPublicMu } = useMutation<
    SaveOrderResponsePublic,
    AxiosError,
    SaveOrderRequestPublic
    >((data) => saveOrderPublic(data), {
        onSuccess: () => {
            notify();
            setSelectedRegion('');
            setSelectedProvince('');
            setSelectedCity('');
            setSelectedBarangay('');
            queryClient.invalidateQueries('pending-order-data');
            queryClient.invalidateQueries('active-order-data');
            queryClient.invalidateQueries('shipped-order-data');
            queryClient.invalidateQueries('delivered-order-data');
            queryClient.invalidateQueries('cancelled-order-data');
            // sendEmail(data.orderData[0].customer.emailAddress, "qwe", "qweqwe");
            navigate('/success');
            localStorage.clear();
        },
        onError: (error: unknown) => {
            console.log(error);
        },
    });

    const handleSaveOrder = async (data: SaveOrderRequestPublic) => {

        const productsInfo: CompleteProductInfo[] = checkOutAtomValue.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantity: product.quantity,
            discountedPrice: product.discountedPrice,
            freebies: product.productFreebies
        }));

        const params: SaveOrderRequestPublic = {
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
            product: productsInfo,
            total:total,
            orderStatus: "PEN"
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
                        ${productsInfo.map(product => `<li>${product.productName} - <strong>(${product.quantity})</strong></li>`).join('')}
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

        // setCompleteCheckOutAtomValue((prevCompleteCheckOut) => [...prevCompleteCheckOut, params]);
        saveOrderPublicMu(params);
        sendEmail(data.customer.emailAddress, "Order Confirmation", emailBody);
      };
    
	return (
		<div className='w-full h-full'>
			<div className='sticky top-0 z-50 drop-shadow-md shadow-black bg-[#f3efef]'>
                <TopBar />
            </div>
			<div className='mt-12 bg-white relative pb-12'>
                <div className='flex justify-center items-center gap-8 max-sm:flex-col-reverse'>
                    <div className='flex flex-col flex-1 justify-end items-end w-full min-h-[80dvh]'>
                    <Form {...orderFormPublic}>
                        <form onSubmit={orderFormPublic.handleSubmit(handleSaveOrder)} className='flex justify-end items-end w-[50%] flex-col gap-4 max-sm:w-full max-sm:pr-12 max-sm:pl-12'>
                            <span className='text-2xl w-full flex justify-start items-start'>Contact</span>
                            <FormField
                                control={orderFormPublic.control}
                                name='customer.contactNumber'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full w-full'>
                                        <FormControl>
                                        <Input 
                                        id='customer.contactNumber'
                                        className='focus-visible:ring-[#63B38F]' 
                                        placeholder='Contact Nummber'
                                        type='text'
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                        />
                                        </FormControl>
                                        <FormDescription className='text-red-500 ml-1'>
                                            {fieldState.error?.message}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <span className='mt-4 text-2xl w-full flex justify-start items-start'>Delivery</span>
                            <div className='w-full flex justify-center items-center gap-4'>
                                <FormField
                                    control={orderFormPublic.control}
                                    name='customer.firstName'
                                    render={({ field, fieldState }) => (
                                        <FormItem className='col-span-full w-full flex-1'>
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
                                            <FormDescription className='text-red-500 ml-1'>
                                                {fieldState.error?.message}
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                control={orderFormPublic.control}
                                name='customer.lastName'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full w-full flex-1'>
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
                                        <FormDescription className='text-red-500 ml-1'>
                                            {fieldState.error?.message}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            </div>
                            <FormField
                                control={orderFormPublic.control}
                                name='customer.emailAddress'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full w-full'>
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
                                        <FormDescription className='text-red-500 ml-1'>
                                            {fieldState.error?.message}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={orderFormPublic.control}
                                name='completeAddress.address'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full w-full'>
                                        <FormControl>
                                        <Input 
                                        id='completeAddress.address'
                                        className='focus-visible:ring-[#63B38F]' 
                                        placeholder='Address'
                                        type='text'
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                        />
                                        </FormControl>
                                        <FormDescription className='text-red-500 ml-1'>
                                            {fieldState.error?.message}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={orderFormPublic.control}
                                name='completeAddress.landMark'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full w-full'>
                                        <FormControl>
                                        <Input 
                                        id='completeAddress.landMark'
                                        className='focus-visible:ring-[#63B38F]' 
                                        placeholder='Landmark to locate you easily'
                                        type='text'
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                        />
                                        </FormControl>
                                        <FormDescription className='text-red-500 ml-1'>
                                            {fieldState.error?.message}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={orderFormPublic.control}
                                name='completeAddress.houseNumber'
                                render={({ field, fieldState }) => (
                                    <FormItem className='col-span-full w-full'>
                                        <FormControl>
                                        <Input 
                                        id='completeAddress.houseNumber'
                                        className='focus-visible:ring-[#63B38F]' 
                                        placeholder='Apartment, suite, etc.'
                                        type='text'
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                        />
                                        </FormControl>
                                        <FormDescription className='text-red-500 ml-1'>
                                            {fieldState.error?.message}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-center items-center w-full gap-3'>
                                {/* Region Dropdown */}
                                <select
                                    className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    value={selectedRegion}
                                    onChange={(e) => {
                                    setSelectedRegion(e.target.value);
                                    setSelectedProvince('');
                                    setSelectedCity('');
                                    setSelectedBarangay('');
                                    }}
                                >
                                    <option value='' disabled>
                                    Select Region
                                    </option>
                                    {Object.entries(places).map(([regionKey, region]) => (
                                    <option key={regionKey} value={regionKey}>
                                        {region.region_name}
                                    </option>
                                    ))}
                                </select>

                                {/* Province Dropdown */}
                                <select
                                    className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    value={selectedProvince}
                                    onChange={(e) => {
                                    setSelectedProvince(e.target.value);
                                    setSelectedCity('');
                                    setSelectedBarangay('');
                                    }}
                                    disabled={!selectedRegion}
                                >
                                    <option value='' disabled>
                                    Select Province
                                    </option>
                                    {selectedRegion &&
                                    places[selectedRegion]?.province_list &&
                                    Object.keys(places[selectedRegion]?.province_list ?? {}).map((province) => (
                                        <option key={province} value={province}>
                                        {province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex justify-center items-center w-full gap-3'>
                                {/* City/Municipality Dropdown */}
                                <select
                                    className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    value={selectedCity}
                                    onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setSelectedBarangay('');
                                    }}
                                    disabled={!selectedRegion || !selectedProvince}
                                >
                                    <option value='' disabled>
                                    Select City/Municipality
                                    </option>
                                    {selectedRegion &&
                                    selectedProvince &&
                                    places[selectedRegion]?.province_list?.[selectedProvince]?.municipality_list &&
                                    Object.keys(places[selectedRegion]?.province_list[selectedProvince]?.municipality_list ?? {}).map((city) => (
                                        <option key={city} value={city}>
                                        {city}
                                        </option>
                                    ))}
                                </select>

                                {/* Barangay Dropdown */}
                                <select
                                    className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    value={selectedBarangay}
                                    onChange={(e) => setSelectedBarangay(e.target.value)}
                                    disabled={!selectedRegion || !selectedProvince || !selectedCity}
                                >
                                    <option value='' disabled>
                                    Select Barangay
                                    </option>
                                    {selectedRegion &&
                                    selectedProvince &&
                                    selectedCity &&
                                    places[selectedRegion]?.province_list?.[selectedProvince]?.municipality_list?.[selectedCity]?.barangay_list?.map(
                                        (barangay) => (
                                        <option key={barangay} value={barangay}>
                                            {barangay}
                                        </option>
                                        )
                                    )}
                                </select>
                            </div>
                        <div className='mt-8 flex justify-start items-start w-[100%] flex-col gap-4 max-sm:w-full max-sm:mt-12'>
                           <span className='mt-4 text-2xl w-full flex justify-start items-start max-sm:mt-1'>Shipping Fee</span>
                           <div className='mt-2 text-md w-full flex justify-start items-start border p-4 rounded-md bg-[#f0e4dd] max-sm:mt-1'>
                             <span className='w-full flex justify-start items-start'>Free Shipping</span>
                             <span className='w-full flex justify-end items-end'>Free</span>
                           </div>
                        </div>
                        <div className='mt-4 flex justify-start items-start w-[100%] flex-col gap-4 max-sm:w-full max-sm:mt-8'>
                           <span className='mt-4 text-3xl w-full flex justify-start items-start max-sm:mt-1'>Payment</span>
                           <span className='text-sm w-full flex justify-start items-start max-sm:mt-1'>All transactions are secure and encrypted.</span>
                           <div className='mt-2 text-md w-full flex justify-start items-start border p-4 rounded-md bg-[#f0e4dd] max-sm:mt-0'>
                             <span className='w-full flex justify-start items-start'>Cash On Delivery</span>
                             <span className='w-full flex justify-end items-end'>(COD)</span>
                           </div>
                        </div>
                        {/* wewew */}
                        <div className='mt-8 flex justify-start items-start w-[100%] max-sm:w-full max-sm:mt-12'>
                            <button disabled={selectedBarangay === '' || selectedCity === '' || selectedProvince === '' || selectedRegion === '' ? true : false} type='submit' className={`${selectedBarangay === '' || selectedCity === '' || selectedProvince === '' || selectedRegion === '' ? 'opacity-50' : 'opacity-100'} w-full text-lg font-normal text-white bg-[#615656] p-4 rounded-md pl-16 pr-16 tracking-widest hover:bg-[#867777] max-sm:pl-6 max-sm:pr-6 max-sm:text-lg`}>COMPLETE ORDER</button>
                        </div>
                    </form>
                    </Form>
                    </div>   
                    <div className='flex flex-col flex-1 w-[80%] min-h-[80dvh] max-sm:border-b lg:border-l xl:border-l 2xl:border-l'>
                           <div className='flex flex-col justify-start items-start max-sm:w-full pr-12 pl-12 max-sm:pr-2 max-sm:pl-2'>
                                {
                                    checkOutAtomValue.map((index, key) => (
                                    <div key={key} className='relative w-full p-4 flex gap-12 border-b max-sm:flex-col max-sm:gap-4 max-sm:justify-center max-sm:items-center max-sm:text-center max-sm:text-sm'>
                                        <img
                                        className='w-24 h-24'
                                        src={index.productImg
                                            ?.replace(/\\/g, '')
                                            ?.replace(/"/g, '')
                                            ?.replace(/\[/g, '')
                                            ?.replace(/\]/g, '')
                                            ?.split(',')[0] || NoImage}
                                        alt={index.productName || 'Product Name'} 
                                        />
                                        <span className='absolute w-5 h-5 rounded-full bg-[#F36000] text-sm flex justify-center items-center top-2 text-white p-1 max-sm:left-4'>{(index.quantity)}</span>
                                        <div className='w-full flex flex-col gap-3'>
                                            <p>{index?.productName}</p>
                                            <div className='flex justify-start items-start w-full h-full gap-2 max-sm:justify-center max-sm:items-center'>
                                                <StarRatings
                                                    rating={index.rating}
                                                    starRatedColor="#FCD53F"
                                                    numberOfStars={1}
                                                    name='rating'
                                                    starDimension='16px'
                                                />
                                                <div className='text-gray-400 text-sm mt-1'>{index.rating} ratings |</div>
                                                <div className='text-gray-400 text-sm mt-1'>{index.productSold} sold</div>
                                            </div>
                                        </div>
                                        <div className='ml-8 w-[30%] flex justify-center items-center max-sm:ml-0'>
                                            <p className='text-[#F36000]'>₱{index.quantity && index.price ? (index.quantity * index.price).toFixed(2) : 0}</p>
                                        </div>
                                    </div>
                                    ))
                                }
                           </div>
                           <div className='mt-12 w-full flex flex-col justify-start items-start max-sm:w-full pr-12 pl-12 gap-4 text-xl max-sm:pb-12 max-sm:pr-2 max-sm:pl-2 max-sm:text-sm max-sm:justify-center max-sm:items-center'>
                                <div className='w-[95%] flex justify-center items-center pl-4 max-sm:pl-0'>
                                    <p className='flex flex-1 justify-start items-start font-semibold'>Subtotal</p>
                                    <p className='flex flex-1 justify-end items-end '>₱{total.toFixed(2)}</p>
                                </div>
                                <div className='w-[95%] flex justify-center items-center pl-4 max-sm:pl-0'>
                                    <p className='flex flex-1 justify-start items-start font-semibold'>Shipping Fee</p>
                                    <p className='flex flex-1 justify-end items-end'>FREE</p>
                                </div>
                                <div className='w-[95%] flex justify-center items-center text-3xl mt-4 max-sm:text-[20px] pl-4 max-sm:pl-0'>
                                    <p className='flex flex-1 justify-start items-start font-semibold '>Total</p>
                                    <p className='flex flex-1 justify-end items-end font-semibold max-sm:font-normal'>₱{total.toFixed(2)}</p>
                                </div>
                           </div>
                    </div>
                </div>
            </div>
			<div className='mt-24'>
				<Footer />
			</div>
		</div>
	);

};

export default CheckOut;

