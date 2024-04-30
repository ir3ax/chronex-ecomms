import { useNavigate } from 'react-router-dom'
import chronexLogo from '../../../assets/CHRONEX-LOGO-bg.png'
import basket from '../../../assets/topBar/shopping-cart.png'
import { cartDetailsAtom } from '../../../atom/cartDetailsAtom';
import { useAtom } from 'jotai';
import React from 'react';
import { CartProduct } from '../../../service/cart/schema';

export const TopBar = () => {
    
    const navigate = useNavigate();

    const [cartDetails] = useAtom(cartDetailsAtom);

    const isQuantityDefined = (product: CartProduct): product is CartProduct & { quantity: number } => {
        return typeof product.quantity === 'number';
      };
    
      // Calculate the total quantity
      const totalQuantity = React.useMemo(() => {
        return cartDetails?.products.reduce((acc, product) => {
          // Check if quantity is defined before adding to the accumulator
          return isQuantityDefined(product) ? acc + product.quantity : acc;
        }, 0) || 0;
      }, [cartDetails]);

      const handleNavigateToCart = () => {
        navigate('/cart');
        window.scrollTo(0, 0);
      }
    
    return (
        <nav className='w-full h-full top-0 z-10 pt-4 pb-4 pl-36 pr-36 max-sm:pr-6 max-sm:pl-6'>
            <div className='flex justify-center items-center'>
                <div className='flex flex-1 justify-center items-center h-20'>
                    <button onClick={() => navigate('/')}>
                        <img className='w-[28%] max-sm:w-[70%]' src={chronexLogo} alt='Chronex Logo' />
                    </button>
                </div>
                <button onClick={handleNavigateToCart} className='flex flex-1 justify-end items-end cursor-pointer relative'>
                    {
                        totalQuantity <= 0 ?
                        null
                        :
                        <span className='absolute w-5 h-5 rounded-full bg-red-600 text-sm flex justify-center items-center -top-2 -right-4 text-white p-1'>{totalQuantity}</span>
                    }
                    <img className='w-8 h-8 max-sm:w-6 max-sm:h-6' src={basket} alt='basket' />
                </button>
            </div>
        </nav>
    )
}