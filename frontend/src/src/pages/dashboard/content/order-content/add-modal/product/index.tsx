import { useState } from 'react';
import { IoIosAdd, IoMdClose } from 'react-icons/io';
import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { getAllProduct } from '../../../../../../service/product-service';
import { productAddAtom } from '../../../../../../atom/orderAtom';
import { Input } from '../../../../../../components/input';
import { getAllFreebies } from '../../../../../../service/freebies';

interface Product {
    productId: string;
    productName: string;
    discountedPrice: number;
    quantity: number;
    freebies: string;
}

export const AddProductModal = () => {
  const [product, setProduct] = useAtom(productAddAtom);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [sortOption] = useState('ATOZ');
  const [selectedFreebiesId, setSelectedFreebiesId] = useState<string>('');
  const [sortOptionFreebies] = useState('ATOZ');

  const { data: productData } = useQuery(
    ['product-data-order', sortOption],
    () => getAllProduct(sortOption || 'ATOZ'),
  );

  const { data: freebiesData } = useQuery(
    ['freebies-data-order', sortOptionFreebies],
    () => getAllFreebies(sortOptionFreebies || 'ATOZ'),
  );

  const handleProductSelection = (productId: string) => {
    // Check if the freebie is already in the state
    if (product.find(item => item.productId === productId)) {
        return;
    }
    
    const selectedProduct = productData?.productData.find(item => item.productId === productId);
    if (selectedProduct) {
        // Ensure the selected product has the 'quantity' property, provide a default value if necessary
        const productToAdd: Product = {
            productId: selectedProduct.productId,
            productName: selectedProduct.productName,
            discountedPrice: selectedProduct.discountedPrice,
            quantity: selectedQuantity,
            freebies: selectedFreebiesId
        };
        setProduct([...product, productToAdd]);
    }
};

  const handleAddButtonClick = () => {
    handleProductSelection(selectedProductId);
    setSelectedProductId('')
    setSelectedFreebiesId('')
    setSelectedQuantity(0)
  };

  const handleRemoveProduct = (index: number) => {
    setProduct(prevProduct => prevProduct.filter((_, i) => i !== index));
  };

  return (
    <div className='w-full pb-8'> 
      <div className='w-full flex justify-start items-start'>
        <h1 className='text-lg'>Product:</h1>
      </div>
      <div className='mt-6 w-full flex flex-row gap-2'>
        <select
          className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
        >
          <option value='' disabled>
            Select Product
          </option>
          {productData && productData.productData && productData?.productData.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
        <div className='w-[10%] gap-2'>
            <Input 
                id='quantity'
                className='focus-visible:ring-[#63B38F]' 
                placeholder='Quantity'
                type='number'
                defaultValue={0}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
            />            
        </div>
        <button 
          type='button'
          className={`${selectedQuantity === 0 ? 'opacity-30' : null} w-[5%] h-[40px] p-2 border border-[#63B38F] rounded-md flex justify-center items-center cursor-pointer hover:bg-[#bdfce0]`}
          onClick={handleAddButtonClick}
          disabled={selectedQuantity === 0 ? true : false}
        >
          <IoIosAdd className='w-6 h-6' />
        </button> 
      </div>
      <select
          className='mt-2 flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          value={selectedFreebiesId}
          onChange={(event) => setSelectedFreebiesId(event.target.value)}
        >
          <option value='' disabled>
            Select Freebies
          </option>
          {freebiesData && freebiesData.freebiesData && freebiesData?.freebiesData.map((freebies) => (
            <option key={freebies.freebiesId} value={freebies.freebiesName}>
              {freebies.freebiesName}
            </option>
          ))}
        </select>
      <div className='mt-6 flex flex-1 bg-[#172539] border border-[#63B38F] min-h-[50dvh] max-h-[50dvh] px-4 py-4 overflow-auto'>
        {/* Display added freebies */}
        <ul className='w-full flex flex-col gap-4'>
            {product && product.map((product, index) => (
              <li className='w-full flex border border-dashed p-4 relative rounded-md' key={index}>
                <div className='flex flex-col flex-1 justify-center items-start gap-2 mt-2'>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Id:</span> {product.productId}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Name:</span> {product.productName}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Store Price:</span> {product.discountedPrice}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Quantity:</span> {product.quantity}</p>
                  {
                    product.freebies ? 
                    <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Freebies:</span> {product.freebies}</p>
                    :
                    null
                  }
                </div>
                {/* Display freebies image */}
                <div className='flex flex-1 justify-end items-center mr-12'>
                  <button
                        type='button'
                        className='text-red-500 absolute top-1 right-1'
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <IoMdClose className='w-6 h-6' />
                      </button>
                </div>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};
