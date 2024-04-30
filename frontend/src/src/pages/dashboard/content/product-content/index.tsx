
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoAddCircleOutline } from "react-icons/io5";
import { ModalView } from "./add-modal";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAllProduct } from "../../../../service/product-service";
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";
import { PiListMagnifyingGlassBold } from "react-icons/pi";
import { ViewingModal } from "./viewing-modal";
import { ToastContainer } from "react-toastify";
import NoImage  from '../../../../assets/utilities/no-image.png'
import { ModalViewUpdate } from "./update-modal";
import { ProductModalViewUpdateQuantity } from "./add-quantity-modal";
import { MinusProductModalViewUpdateQuantity } from "./minus-quantity-modal";
import { ProductModalViewDelete } from "./delete-modal";
import { NoData } from "../../../no-data";

export const ProductContent = () => {

    const [openView, setOpenView] = useState<boolean>(false);
    const [openViewing, setOpenViewing] = useState<boolean>(false);
    const [openViewingUpdate, setOpenViewingUpdate] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('ATOZ');
    const [productOpenViewUpdateQuantity, setProductOpenViewUpdateQuantity] = useState<boolean>(false);
    const [productOpenViewUpdateQuantityMinus, setProductOpenViewUpdateQuantityMinus] = useState<boolean>(false);
    const [openViewDeleteProduct, setOpenViewDeleteProduct] = useState<boolean>(false);

    const { data: productData } = useQuery(
        ['product-data', sortOption, search],
        () => getAllProduct(sortOption || 'ATOZ', search),
    );
    
    const handleSortSelect = (e: string) => {
        setSortOption(e)
        queryClient.invalidateQueries('product-data');
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleCloseView = () => {
        setOpenView(false);
    }

    const handleCloseViewing = () => {
        setOpenViewing(false);
    }

    const handleCloseViewingUpdate = () => {
        setOpenViewingUpdate(false);
    }

    const handleCloseProductViewUpdateQuantity = () => {
        setProductOpenViewUpdateQuantity(false);
    };

    const handleCloseProductViewUpdateQuantityMinus = () => {
        setProductOpenViewUpdateQuantityMinus(false);
    };

    const handleCloseViewDeleteProduct = () => {
        setOpenViewDeleteProduct(false);
    };

    //Update Freebies Quantity Minus
    const [productDetailsViewing, setProductDetailsViewing] = useState({
        img: "",
        productName: "",
        originalPrice: 0,
        discount: 0,
        discountedPrice: 0,
        originalQuantity: 0,
        currentQuantity: 0,
        productSold: 0,
        productFreebies: "",
        description1: "",
        description2: "",
    });

    const handleModalProductDetailsViewing = (img: string, productName: string, discount: number, originalPrice: number, discountedPrice: number, originalQuantity: number, currentQuantity: number, productSold: number, productFreebies: string, description1: string, description2: string) => {
        const updatedProductDetailsViewing = {
            img: img,
            productName: productName,
            discount: discount,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            originalQuantity: originalQuantity,
            currentQuantity: currentQuantity,
            productSold: productSold,
            productFreebies: productFreebies,
            description1: description1,
            description2: description2
        };
    
        setProductDetailsViewing(updatedProductDetailsViewing);
    
        setOpenViewing(true);
    }


    //Update Freebies Details
    const [productUpdateState, setProductUpdateState] = useState({
        productId: "",
        img: "",
        productName: "",
        originalPrice: 0,
        discount: 0,
        supplierPrice: 0,
        discountedPrice: 0,
        originalQuantity: 0,
        currentQuantity: 0,
        productSold: 0,
        productFreebies: "",
        description1: "",
        description2: "",
        productStatus:""
    });
    
    const handleModalProductUpdate = (productStatus:string, productId:string, img: string, productName: string, discount: number, supplierPrice: number, originalPrice: number, discountedPrice: number, originalQuantity: number, currentQuantity: number, productSold: number, productFreebies: string, description1: string, description2: string) => {
        const updatedValues = {
            productId: productId,
            img: img,
            productName: productName,
            discount: discount,
            supplierPrice: supplierPrice,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            originalQuantity: originalQuantity,
            currentQuantity: currentQuantity,
            productSold: productSold,
            productFreebies: productFreebies,
            description1: description1,
            description2: description2,
            productStatus: productStatus
        };
    
        setProductUpdateState(updatedValues);
    
        setOpenViewingUpdate(true);
    }

    //Update Freebies Quantity Add
    const [propductStateQuantity, setProductStateQuantity] = useState({
        productId: "",
        productOriginalQuantity: 0,
        productCurrentQuantity: 0
    });

    const handleModalProductUpdateQuantity = (productId: string, productOriginalQuantity: number, productCurrentQuantity: number) => {
        const updatedValuesQuantity = {
            productId: productId,
            productOriginalQuantity: productOriginalQuantity,
            productCurrentQuantity: productCurrentQuantity
        };
    
        setProductStateQuantity(updatedValuesQuantity);
    
        setProductOpenViewUpdateQuantity(true);
    }

    //Update Freebies Quantity Minus
    const [propductStateQuantityMinus, setProductStateQuantityMinus] = useState({
        productId: "",
        productOriginalQuantity: 0,
        productCurrentQuantity: 0
    });

    const handleModalProductUpdateQuantityMinus = (productId: string, productOriginalQuantity: number, productCurrentQuantity: number) => {
        const updatedValuesQuantity = {
            productId: productId,
            productOriginalQuantity: productOriginalQuantity,
            productCurrentQuantity: productCurrentQuantity
        };
    
        setProductStateQuantityMinus(updatedValuesQuantity);
    
        setProductOpenViewUpdateQuantityMinus(true);
    }

    //Delete Product
    const [productStateDelete, setProductStateDelete] = useState({
        productId: "",
        productStatus: "",
    });

    const handleModalDeleteProduct = (productId: string, productStatus: string) => {
        const deletedValues = {
            productId: productId,
            productStatus: productStatus,
        };
    
        setProductStateDelete(deletedValues);
    
        setOpenViewDeleteProduct(true);
    }
    
    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            <ToastContainer theme='dark' />
            <ModalView isVisible={openView} handleClose={handleCloseView} />
            <ModalViewUpdate productStatus={productUpdateState.productStatus} productId={productUpdateState.productId} img={productUpdateState.img} productName={productUpdateState.productName} discount={productUpdateState.discount} supplierPrice={productUpdateState.supplierPrice} originalPrice={productUpdateState.originalPrice} discountedPrice={productUpdateState.discountedPrice} originalQuantity={productUpdateState.originalQuantity} currentQuantity={productUpdateState.currentQuantity} productSold={productUpdateState.productSold} productFreebies={productUpdateState.productFreebies} description1={productUpdateState.description1} description2={productUpdateState.description2} isVisible={openViewingUpdate} handleClose={handleCloseViewingUpdate}/>
            <ProductModalViewUpdateQuantity isVisible={productOpenViewUpdateQuantity} handleClose={handleCloseProductViewUpdateQuantity} productId={propductStateQuantity.productId} productOriginalQuantity={propductStateQuantity.productOriginalQuantity} productCurrentQuantity={propductStateQuantity.productCurrentQuantity} />
            <MinusProductModalViewUpdateQuantity isVisible={productOpenViewUpdateQuantityMinus} handleClose={handleCloseProductViewUpdateQuantityMinus} productId={propductStateQuantityMinus.productId} productOriginalQuantity={propductStateQuantityMinus.productOriginalQuantity} productCurrentQuantity={propductStateQuantityMinus.productCurrentQuantity} />
            <ProductModalViewDelete isVisible={openViewDeleteProduct} handleClose={handleCloseViewDeleteProduct} productId={productStateDelete.productId} productStatus={productStateDelete.productStatus} />
            <ViewingModal img={productDetailsViewing.img} productName={productDetailsViewing.productName} discount={productDetailsViewing.discount} originalPrice={productDetailsViewing.originalPrice} discountedPrice={productDetailsViewing.discountedPrice} originalQuantity={productDetailsViewing.originalQuantity} currentQuantity={productDetailsViewing.currentQuantity} productSold={productDetailsViewing.productSold} productFreebies={productDetailsViewing.productFreebies} description1={productDetailsViewing.description1} description2={productDetailsViewing.description2} isVisible={openViewing} handleClose={handleCloseViewing}/>
                <div className='flex w-full'>
                    <div className='relative w-full flex flex-1 justify-start items-start'>
                        <span className='absolute top-3 left-4'>
                            <HiMagnifyingGlass />
                        </span>
                        <input
                            className='flex w-[80%] h-[40px] rounded-md border border-input bg-background px-12 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63B38F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            type='search' 
                            placeholder='Search'
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className='w-full flex flex-1 justify-end items-end'>
                        <button
                        className='flex justify-center items-center gap-2 pl-8 pr-8 h-[40px]  rounded-md border text-md bg-[#172539] text-white font-semibold hover:bg-gray-500'
                        onClick={() => setOpenView(true)}
                        >
                            <span>Add Product</span>
                            <span className='mt-[1px]'>
                                <IoAddCircleOutline className='w-6 h-6' />
                            </span>
                        </button>
                    </div>
                </div>
                <div className='mt-12 flex flex-col w-full min-h-[70dvh] text-[#555758]'>
                    <div className='w-full h-full flex'>
                        <span className='ml-1 flex flex-1 justify-start items-start font-semibold text-xl'>My Products</span>
                        <div className='flex justify-end'>
                            <div className="relative h-10 w-48 min-w-[100px]">
                                <select
                                    onChange={(e) => handleSortSelect(e.target.value)}
                                    value={sortOption}
                                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-[#63B38F] focus:border-2 focus:border-[#63B38F] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                                    <option value='ATOZ'>A -&gt; Z</option>
                                    <option value='ZTOA'>Z -&gt; A</option>
                                    <option value='PRICE_HIGH_TO_LOW'>Discounted Price High to Low</option>
                                    <option value='PRICE_LOW_TO_HIGH'>Discounted Price Low to High</option>
                                    <option value='QUANTITY_HIGH_TO_LOW'>Current Quantity High to Low</option>
                                    <option value='QUANTITY_LOW_TO_HIGH'>Current Quantity Low to High</option>
                                    <option value='PRODUCT_SUPPLIER_HIGH_TO_LOW'>Supplier High to Low</option>
                                    <option value='PRODUCT_SUPPLIER_LOW_TO_HIGH'>Supplier Low to High</option>
                                </select>
                                <label
                                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#63B38F] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-[#63B38F] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#63B38F] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    SORT LIST BY
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 bg-white w-full h-full min-h-[60dvh] border'>
                        <div className=' bg-white w-full h-full max-h-[60dvh] min-h-[60dvh] justify-center items-start flex overflow-auto p-12'>
                            <div className='w-full h-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-12'>
                                {productData?.productData ? (
                                    productData?.productData.map((item, index) => (
                                        <div key={index} className='flex flex-col justify-center items-center border bg-white shadow-2xl shadow-gray-400'>
                                            <div className='w-full h-full flex flex-col justify-center items-center'>
                                                <div className={`relative w-full flex justify-center items-center ${item.productStatus === 'SOLD' ? 'bg-[#233857]' : 'bg-[#233857]'} p-6 rounded-t-md`}>
                                                {item.img
                                                .replace(/\\/g, '') 
                                                .replace(/"/g, '')  
                                                .replace(/\[/g, '') 
                                                .replace(/\]/g, '') !== '' ? (
                                                    <img
                                                        className='rounded-md w-32 h-32'
                                                        src={item.img
                                                            .replace(/\\/g, '') 
                                                            .replace(/"/g, '')  
                                                            .replace(/\[/g, '') 
                                                            .replace(/\]/g, '') 
                                                            .split(',')[0]     
                                                        }
                                                        alt="Product Image"
                                                    />
                                                ) : (
                                                    <img
                                                        className='rounded-md w-32 h-32'
                                                        src={NoImage}
                                                        alt="Product Image"
                                                    />
                                                )}
                                                <button onClick={() => handleModalProductDetailsViewing(item.img, item.productName, item.discount, item.originalPrice, item.discountedPrice, item.originalQuantity, item.currentQuantity, item.productSold, item.productFreebies, item.description1, item.description2)} className='absolute left-2 top-2 text-gray-300 hover:text-[#70CE98] cursor-pointer'>
                                                    <PiListMagnifyingGlassBold  className='w-8 h-8' />
                                                </button>
                                                <button onClick={() => handleModalProductUpdateQuantity(item.productId, item.originalQuantity, item.currentQuantity)} className='absolute right-2 top-2 text-gray-300 hover:text-[#70CE98] cursor-pointer'>
                                                    <IoMdAdd className='w-8 h-8' />
                                                </button>
                                                <button onClick={() => handleModalProductUpdateQuantityMinus(item.productId, item.originalQuantity, item.currentQuantity)} className='absolute right-3 top-10 text-gray-300 hover:text-[#70CE98] cursor-pointer'>
                                                    <FaMinus className='w-[25px] h-8' />
                                                </button>
                                                </div>
                                                <div className='py-6 w-full flex flex-col justify-start items-start gap-2 p-6 text-[#272727]'>
                                                    <span className='line-clamp-1'><span className='font-semibold text-[#e68a55]'>Name:</span> {item.productName}</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Supplier Price:</span> ₱{item.supplierPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Discount:</span> {item.discount}% OFF</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Original Price:</span> ₱{item.originalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Discounted Price:</span> ₱{item.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Original Quantity:</span> {item.originalQuantity}</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Current Quantity:</span> {item.currentQuantity === 0 ? 0 : item.currentQuantity}</span>
                                                    <span><span className='font-semibold text-[#e68a55]'>Product Sold:</span> {item.productSold}</span>
                                                    <span className={`${item.productStatus === 'INC' ? 'text-[#E61923]' : item.productStatus === 'SOLD' ? 'text-[#ec8142]' : 'text-[#428925]'} font-bold`}><span className='font-semibold text-[#e68a55]'>Product Status:</span> {item.productStatus}</span>
                                                </div>
                                                <button onClick={() => handleModalProductUpdate(item.productStatus, item.productId, item.img, item.productName, item.discount, item.supplierPrice, item.originalPrice, item.discountedPrice, item.originalQuantity, item.currentQuantity, item.productSold, item.productFreebies, item.description1, item.description2)} className='w-full font-semibold flex justify-center items-center bg-[#0091C3] text-white p-2 cursor-pointer hover:bg-[#4da1bd]'>
                                                    UPDATE
                                                </button>
                                                <button onClick={() => handleModalDeleteProduct(item.productId, item.productStatus)} className='w-full font-semibold flex justify-center items-center bg-[#F44537] text-white p-2 cursor-pointer hover:bg-[#d45951]'>
                                                    DELETE
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='col-span-4 row-span-8 text-center flex justify-center items-center w-full h-full'>
                                        <NoData />  
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}