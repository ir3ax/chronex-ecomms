import { FcPositiveDynamic } from 'react-icons/fc';
import { Modal } from '../../../../../components/modal';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { generateBestSelling } from '../../../../../service/generate-report';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
}

export const ModalBestSellingView = (props: Xprox) => {

    const notify = () => toast("Successfully downloaded!");

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];  
    const [month, setMonth] = useState<number>(1);

    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 2;
    const maxYear = currentYear + 2;
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);
    const [year, setYear] = useState<number>(currentYear);

    const handleClose = () => {
        setMonth(1);
        setYear(currentYear);
        props.handleClose();
    }

    const handleSubmit = () => {
        generateBestSelling(month, year);
        notify();
        props.handleClose();
    }

    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[42rem] h-[30rem] bg-white p-8 overflow-auto'>
                <form className='w-full h-full'>
                  <div className='w-full h-full flex flex-col justify-center items-start'>
                    <div className='w-full flex flex-col justify-center items-center gap-6 p-12'>
                      <FcPositiveDynamic className='w-24 h-24 text-[#172539]' />
                      <span className='text-xl tracking-wide text-center'>Choose the month and year to generate.</span>
                    </div>

                    <div className='mt-4 w-full h-full flex gap-4'>
                        <select
                            name='month'
                            className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            value={month}
                            onChange={(event) => setMonth(parseInt(event.target.value))}
                            >
                            <option value='' disabled>
                                Select Month
                            </option>
                            {months.map((name, index) => (
                                <option key={index} value={index + 1}>
                                {name}
                                </option>
                            ))}
                        </select>
                        <select
                            name='year'
                            className='flex w-[50%] h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            value={year}
                            onChange={(event) => setYear(parseInt(event.target.value))}
                            >
                            <option value='' disabled>
                                Select Year
                            </option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                {year}
                                </option>
                            ))}
                            </select>
                    </div>

                    <div className='w-full flex justify-end items-center gap-4'>
                      <button type='button' className='border pt-2 pb-2 pr-4 pl-4 bg-[#fcf8f7] text-black cursor-pointer hover:bg-[#dddada] rounded-md' onClick={handleClose}>CANCEL</button>
                      <button type='button' onClick={() => handleSubmit()} className='border pt-2 pb-2 pr-4 pl-4 bg-[#2b8f9c] text-white cursor-pointer hover:bg-[#45a4b1] rounded-md'>GENERATE</button>
                    </div>
                  </div>
                </form>
        </div>
      </Modal>
    )
}

