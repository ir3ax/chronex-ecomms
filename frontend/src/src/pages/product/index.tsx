import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings'
import { productDetailsAtom } from '../../atom/productDetailsAtom';
interface Review {
    reviewsId: string;
    productId: string;
    reviewsName: string;
    reviewsSubject: string;
    reviewsMessage: string;
    reviewsStarRating: number;
    createdAt: number;
}
interface ProductProps {
    productId: string;
    img: string;
    productName: string;
    discount: number;
    originalPrice: number;
    discountedPrice: number;
    description1: string;
    description2: string;
    originalQuantity: number;
    currentQuantity: number;
    productStatus:string;
    productSold:number;
    productFreebies: string;
    productReviews: Review[];
}

export const ProductPage: React.FC<ProductProps> = ({ productId, img, productName, discount, originalPrice, discountedPrice, description1, description2, originalQuantity, currentQuantity, productStatus, productSold, productFreebies, productReviews }) => {

    const navigate = useNavigate();
    const setProductDetailsData = useSetAtom(productDetailsAtom)

    const averageRating = productReviews.length > 0
    ? parseFloat((productReviews.reduce((sum, review) => sum + review.reviewsStarRating, 0) / productReviews.length).toFixed(1))
    : 0;

    const redirectToProductDetails = () => {
        setProductDetailsData({
            productId: productId,
            img: img,
            productName: productName, 
            discount: discount,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            description1: description1,
            description2: description2,
            originalQuantity: originalQuantity,
            currentQuantity: currentQuantity,
            productStatus:productStatus,
            productRating: averageRating,
            productSold: productSold,
            productFreebies: productFreebies,
            freebies: productFreebies
        })
        navigate(`/product-details/${productId}`);
        window.scrollTo(0, 0);
    }

    return (
        <button onClick={redirectToProductDetails} disabled={productStatus === 'SOLD' ? true : false} className={`relative w-full h-full p-6 flex flex-col justify-center items-center text-center gap-2 max-sm:pl-10 max-sm:pr-10 border rounded-md shadow-black shadow-sm`}>
            {
                productStatus === 'SOLD' ?
                <p className='z-50 flex justify-center items-center absolute pl-8 pr-8 pt-3 pb-3 rounded-md bg-[#8b7575] font-bold text-white'>SOLD OUT</p>
                :
                null
            }
            <div className={`w-full h-full ${productStatus === 'SOLD' ? 'opacity-40' : 'opacity-100'}`}>
                <span className='absolute top-0 right-0 bg-[#8b7575] text-white font-bold text-md flex justify-center items-center text-center p-2 rounded-tr-md rounded-bl-md'>
                    {discount}% OFF
                </span>
                <div className='pb-12 flex justify-center items-center '>
                    <img className='w-52 h-52' src={img.replace(/\\/g, '').replace(/"/g, '').replace(/\[/g, '') .replace(/\]/g, '').split(',')[0]} alt={productName}/>
                </div>
                <span className='line-clamp-2 h-12'>{productName}</span>
                <div className='mt-6 w-full h-full flex flex-col'>
                    <div className='flex flex-col justify-start items-start max-sm:justify-center max-sm:items-center gap-3'>
                        <StarRatings
                            rating={averageRating}
                            starRatedColor="#FCD53F"
                            numberOfStars={5}
                            name='rating'
                            starDimension='24px'
                        />
                        <div className='flex justify-start items-start w-full h-full gap-2 max-sm:justify-center max-sm:items-center'>
                            <div className='text-gray-400 text-sm'>{averageRating} ratings |</div>
                            <div className='text-gray-400 text-sm'>{productSold} sold</div>
                        </div>
                    </div>
                    <div className='mt-4 ml-1 flex justify-end items-end text-xl font-bold lg:text-lg'>
                        <div className='flex flex-1 justify-start items-start text-[#A1133A] line-through'>
                            ₱{originalPrice.toFixed(2)}
                        </div>
                        <div className='flex flex-1 justify-end items-end text-[#F36000]'>
                            ₱{discountedPrice.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}