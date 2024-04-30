import { Link } from "react-router-dom"
import Checked from '../../assets/cart/checked.png'
import { TopBar } from "../../components/appLayout/topbar"
import Footer from "../../components/appLayout/footer"
import { useEffect } from "react"

export const Success = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    return(
        <div className='w-full h-full'>
        <div className='sticky top-0 z-50 drop-shadow-md shadow-black bg-[#f3efef]'>
            <TopBar />
        </div>
        <div className='min-h-[90dvh] flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center gap-6 max-sm:p-10'>
                <img className='w-[15%] h-[15%] max-sm:w-[25%] max-sm:h-[25%]' src={Checked}  alt='Empty Cart Logo'/>
                <h1 className='font-semibold text-xl max-sm:text-lg'>Thank You!</h1>
                <p className='text-md max-sm:text-center max-sm:text-sm text-center'>We received your purchase request;<br/>we'll be in touch shortly!</p>
                <Link className='text-2xl font-normal text-white bg-[#615656] p-2 rounded-md pl-24 pr-24 tracking-normal hover:bg-[#867777] max-sm:pl-6 max-sm:pr-6 max-sm:text-lg lg:pr-12 lg:pl-12' to={'/'}>Go to Homepage</Link>
            </div>
        </div>
        <div>
            <Footer />
        </div>
    </div>
    )
}