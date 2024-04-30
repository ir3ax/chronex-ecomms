import { useState } from 'react';
import { IoIosAdd, IoMdClose } from 'react-icons/io';
import { useQuery } from 'react-query';
import { getAllFreebiesDropdown } from '../../../../../../service/freebies';
import { useAtom } from 'jotai';
import { productFreebiesAtom } from '../../../../../../atom/productDetailsAtom';

export const ProductFreebies = () => {
  const [freebies, setFreebies] = useAtom(productFreebiesAtom);
  const [selectedFreebieId, setSelectedFreebieId] = useState<string>('');

  const { data: freebiesData } = useQuery(
    ['freebies-data'],
    () => getAllFreebiesDropdown(),
  );

  const handleFreebieSelection = (freebieId: string) => {
    // Check if the freebie is already in the state
    if (freebies.find(freebie => freebie.freebiesId === freebieId)) {
      return;
    }
    
    const selectedFreebie = freebiesData?.freebiesData.find(freebie => freebie.freebiesId === freebieId);
    if (selectedFreebie) {
      setFreebies([...freebies, selectedFreebie]);
    }
  };

  const handleAddButtonClick = () => {
    handleFreebieSelection(selectedFreebieId);
  };

  const handleRemoveFreebie = (index: number) => {
    setFreebies(prevFreebies => prevFreebies.filter((_, i) => i !== index));
  };

  return (
    <div className='w-full pb-8'> 
      <div className='w-full flex justify-start items-start'>
        <h1 className='text-lg'>Freebies:</h1>
      </div>
      <div className='mt-6 w-full flex gap-2'>
        <select
          className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          value={selectedFreebieId}
          onChange={(event) => setSelectedFreebieId(event.target.value)}
        >
          <option value='' disabled>
            Select Freebies
          </option>
          {freebiesData?.freebiesData && freebiesData.freebiesData.map((freebie) => (
            <option key={freebie.freebiesId} value={freebie.freebiesId}>
              {freebie.freebiesName} ({freebie.freebiesCurrentQuantity}pcs) - ₱{freebie.freebiesStorePrice.toFixed(2)}
            </option>
          ))}
        </select>
        <button 
          type='button'
          className='w-[5%] h-[40px] p-2 border border-[#63B38F] rounded-md flex justify-center items-center cursor-pointer hover:bg-[#bdfce0]'
          onClick={handleAddButtonClick}
        >
          <IoIosAdd className='w-6 h-6' />
        </button> 
      </div>
      <div className='mt-6 flex flex-1 bg-[#172539] border border-[#63B38F] min-h-[50dvh] max-h-[50dvh] px-4 py-4 overflow-auto'>
        {/* Display added freebies */}
        <ul className='w-full flex flex-col gap-4'>
            {freebies && freebies.map((freebie, index) => (
              <li className='w-full flex border border-dashed p-4 relative rounded-md' key={index}>
                <div className='flex flex-col flex-1 justify-center items-start gap-2 mt-2'>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Id:</span> {freebie.freebiesId}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Name:</span> {freebie.freebiesName}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Store Price:</span> {freebie.freebiesStorePrice.toFixed(2)}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Orignal Quantity:</span> {freebie.freebiesOriginalQuantity}</p>
                  <p className='text-gray-300'><span className='font-extrabold text-lg text-white'>Current Quantity:</span> {freebie.freebiesCurrentQuantity}</p>
                </div>
                {/* Display freebies image */}
                <div className='flex flex-1 justify-end items-center mr-12'>
                  {freebie.freebiesImg && (
                    <img src={`data:image/jpeg;base64,${freebie.freebiesImg}`} alt={freebie.freebiesName} className='w-32 h-32 rounded-lg' />
                  )}
                  <button
                        type='button'
                        className='text-red-500 absolute top-1 right-1'
                        onClick={() => handleRemoveFreebie(index)}
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
