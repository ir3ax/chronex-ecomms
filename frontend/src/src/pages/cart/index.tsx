import StarRatings from "react-star-ratings";
import Footer from "../../components/appLayout/footer"
import { TopBar } from "../../components/appLayout/topbar"
import { TableBody, TableCell, TableRow } from "../../components/ui/table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { cartDetailsAtom } from "../../atom/cartDetailsAtom";
import { checkOutAtom } from "../../atom/checkOutAtom";
import { useEffect, useState } from "react";
import EmptyCart from '../../assets/cart/empty-cart.jpg'
import NoImage from '../../assets/utilities/no-image.png'

export const Cart = () => {

const navigate = useNavigate();
const [cartDetails, setCartDetails] = useAtom(cartDetailsAtom);
const [checkOutAtomValue, setCheckOutAtomValue] = useAtom(checkOutAtom);
const [isChecked, setIsChecked] = useState<{ [productId: string]: boolean | undefined }>({});

const total = checkOutAtomValue.reduce((acc, product) => acc + (product.total || 0), 0);

const handleCheckout = () => {
    navigate('/checkout')
}

const onAdd = (productId: string | undefined) => {
    setCartDetails((prevCartDetails) => {
      if (!prevCartDetails) {
        return prevCartDetails;
      }
  
      const updatedCartDetails = {
        ...prevCartDetails,
        products: prevCartDetails.products.map((product) => {
          if (product.productId === productId) {
            const updatedQuantity = (product.quantity ?? 0) + 1;
            const updatedTotal = product.price ? updatedQuantity * product.price : 0;
            
            return {
              ...product,
              quantity: updatedQuantity,
              total: updatedTotal,
            };
          }
          return product;
        }),
      };
  
      return updatedCartDetails;
    });
  };
  
  const onMinus = (productId: string | undefined) => {
    setCartDetails((prevCartDetails) => {
      if (!prevCartDetails) {
        return prevCartDetails;
      }
  
      const updatedCartDetails = {
        ...prevCartDetails,
        products: prevCartDetails.products.map((product) => {
          if (product.productId === productId && (product.quantity ?? 0) > 1) {
            const updatedQuantity = (product.quantity ?? 0) - 1;
            const updatedTotal = product.price ? updatedQuantity * product.price : 0;
  
            return {
              ...product,
              quantity: updatedQuantity,
              total: updatedTotal,
            };
          }
          return product;
        }),
      };
  
      return updatedCartDetails;
    });
  };

  const handleDeleteProduct = (productId: string | undefined) => {
    setCartDetails((prevCartDetails) => {
      if (!prevCartDetails) {
        return prevCartDetails;
      }

      const updatedProducts = prevCartDetails.products.filter((product) => product.productId !== productId);
  
      const updatedCartDetails = {
        ...prevCartDetails,
        products: updatedProducts,
      };

      if (updatedProducts.length === 0) {
        localStorage.clear()
      }
  
      return updatedCartDetails;
    });
  };

  
  const handleCheckboxChangeCart = (productId: string | undefined) => {
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [productId || '']: !prevChecked[productId || ''],
    }));
  };

  useEffect(() => {
    const selectedProducts = cartDetails?.products?.filter((product) => product.productId && isChecked[product.productId]);
    setCheckOutAtomValue(selectedProducts || []);
  }, [isChecked, cartDetails?.products, setCheckOutAtomValue]);


return(
    <div className='w-full h-full'>
       <div className='sticky top-0 z-50 drop-shadow-md shadow-black bg-[#f3efef]'>
            <TopBar />
        </div>
          {
            (cartDetails?.products && cartDetails.products.length < 1) || (!cartDetails?.products || cartDetails.products.length === undefined) ? (
              <div className='min-h-[90dvh] flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center gap-6 max-sm:p-10'>
                  <img className='w-[10%] h-[10%] max-sm:w-[40%] max-sm:h-[40%]' src={EmptyCart} alt='Empty Cart Logo' />
                  <h1 className='font-semibold text-xl max-sm:text-lg'>Your Cart is <span className='text-[#FF1211]'>Empty!</span></h1>
                  <p className='text-md max-sm:text-center max-sm:text-sm'>Must add items to the cart before you proceed to check out.</p>
                  <Link className='text-2xl font-normal text-white bg-[#615656] p-2 rounded-md pl-24 pr-24 tracking-normal hover:animate-bounce max-sm:pl-6 max-sm:pr-6 max-sm:text-lg lg:pr-12 lg:pl-12' to={'/'}>Continue Shopping</Link>
                </div>
              </div>
            )
            :
            <div className='flex flex-col w-full min-h-[90dvh] bg-[#F4F4F4] 2xl:p-24 lg:p-12 text-[#1D1D1D] max-sm:p-2'>
            <div className='w-full h-full text-3xl font-normal tracking-wide'>Your Cart</div>
            <span className='w-[100%]  mt-4 border-b border-black max-sm:w-[100%] lg:w-[100%]' />
            <div className='flex justify-center items-center gap-8 mt-4 max-sm:flex-col max-sm:pb-12'>
                <div className='flex flex-col w-[60%] min-h-[50dvh] max-h-[60vh] overflow-auto max-sm:w-[90%]'>
                {/* <TableHeaders /> */}
                {cartDetails?.products?.map((index, key) => (
                    <TableBody key={key} className='h-full text-center w-full mt-6 bg-white'>  
                        <TableRow className='flex max-sm:flex-col'> 
                            <TableCell className='w-[30%] flex justify-center items-center max-sm:justify-start'>
                              <input
                                  className='w-6 h-6 accent-[#615656]'
                                  type="checkbox"
                                  checked={isChecked[index.productId!] || false}
                                  onChange={() => handleCheckboxChangeCart(index.productId)}
                              />
                            </TableCell>
                            <TableCell className='w-[80%] flex justify-center items-center max-sm:w-[100%]'>
                              <img
                              className='w-24 h-24'
                              src={index.productImg
                                  ?.replace(/\\/g, '')
                                  ?.replace(/"/g, '')
                                  ?.replace(/\[/g, '')
                                  ?.replace(/\]/g, '')
                                  ?.split(',')[0] || NoImage}
                              alt={index.productName || 'Product Name'} />
                            </TableCell>
                            <TableCell className='w-[100%] flex justify-center items-center'>
                                <div className='flex flex-col justify-center items-center gap-4 max-sm:justify-center max-sm:items-center lg:justify-center lg:items-center'>
                                    <div>
                                        {index.productName}
                                    </div>
                                    <div className='flex justify-center items-center w-full h-full gap-2'>
                                    <StarRatings
                                        rating={1}
                                        starRatedColor="#FCD53F"
                                        numberOfStars={1}
                                        name='rating'
                                        starDimension='16px'
                                    />
                                    <div className='text-gray-400 text-sm mt-1'>{index.rating} ratings |</div>
                                    <div className='text-gray-400 text-sm mt-1'>{index.productSold} sold</div>
                                </div>
                                </div>
                            </TableCell> 
                            <TableCell className='w-[50%] max-sm:w-[100%]'>
                                <div className='flex flex-col justify-start items-start gap-4 max-sm:justify-center max-sm:items-center lg:justify-center lg:items-center max-sm:flex-row'>
                                    <div className='text-lg text-[#F36000] font-semibold tracking-wide'>
                                        ₱{index.price?.toFixed(2)}
                                    </div>
                                    <div className='flex justify-center items-center gap-3'>
                                        <div className='text-sm text-gray-400'>
                                            {index.discount}% OFF
                                        </div>
                                        <button onClick={() => handleDeleteProduct(index.productId)} className='text-sm text-gray-400 cursor-pointer'>
                                            <RiDeleteBin6Line className='w-6 h-6' />
                                        </button>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className='w-[100%] flex justify-center items-center'>
                                <div className='flex justify-center items-center w-full mt-4'>
                                    <div className='flex justify-center items-center gap-2 w-[100%] max-sm:justify-center max-sm:w-[70%]'>
                                        <button disabled={index.quantity === 1} onClick={() => onMinus(index.productId)} className={`${index.quantity === 1 ? 'opacity-50' : 'opacity-100'} w-10 h-11 rounded-sm border bg-[#615656] max-sm:w-10 max-sm:h-10 hover:bg-[#918585]`}>
                                            <span className='text-1xl text-white'>-</span>
                                        </button>
                                        <input  value={index.quantity} className='w-8 h-11 border-t border-b text-center max-sm:w-8 max-sm:h-10' />
                                        <button disabled={index.quantity >= (index?.currentQuantity ?? 0)} onClick={() => onAdd(index.productId)} className={`${index.quantity >= (index?.currentQuantity ?? 0) ? 'opacity-50' : 'opacity-100 hover:bg-[#867777]'} w-10 h-11 rounded-sm border bg-[#615656] max-sm:w-10 max-sm:h-10 hover:bg-[#918585]`}>
                                            <span className='text-1xl text-white'>+</span>
                                        </button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                        <span className='h-[2px] w-[10%] bg-slate-700 mt-4 border-b border-slate-700 max-sm:w-[100%] lg:w-[10%]' />
                </TableBody>
                ))}
                </div>
                <div className='flex w-[40%] justify-start items-start border min-h-[50dvh] max-h-[60vh] bg-white max-sm:w-[90%]'>
                <div className='p-12 w-full h-full max-sm:p-4'>
                    <div className='flex flex-col w-full h-full'>
                        <h1 className='text-xl max-sm:text-[16px]'>Order Summary</h1>
                        <span className='w-[100%] border-b max-sm:w-[100%] lg:w-[100%] mt-4' />
                        <div className='flex flex-col mt-8 gap-4'>
                            <div className='flex text-lg'>
                                <p className='flex flex-1 justify-start items-start tracking-wide max-sm:text-[16px]'>Subtotal</p>
                                <p className='flex flex-1 justify-center items-center max-sm:text-[16px]'>₱{total.toFixed(2)}</p>
                            </div>
                            <div className='flex text-lg'>
                                <p className='flex flex-1 justify-start items-start tracking-wide max-sm:text-[16px]'>Shipping Fee</p>
                                <p className='flex flex-1 justify-center items-center max-sm:text-[16px]'>Free</p>
                            </div>
                            <div className='flex text-lg mt-10'>
                                <p className='flex flex-1 justify-start items-start tracking-wide max-sm:text-[16px]'>Total</p>
                                <p className='flex flex-1 justify-center items-center max-sm:text-[16px]'>₱{total.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className='flex justify-start items-start w-full mt-12'>
                            <button disabled={total === 0 ? true : false} onClick={() => handleCheckout()} className={`${total === 0 ? 'opacity-50' : 'opacity-100 hover:bg-[#867777]'} w-[80%] text-2xl font-normal text-white bg-[#615656] p-2 rounded-sm tracking-widest max-sm:pl-6 max-sm:pr-6 max-sm:text-lg lg:w-[100%] lg:text-xl max-sm:text-[16px] max-sm:w-[100%]`}>PROCEED TO CHECKOUT</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        }
        
        <div>
            <Footer />
        </div>
    </div>
)

}