import { Outlet } from "react-router-dom";
import { TopBar } from "./topbar";
import { SlideShow } from "../../pages/slideShow";
import { ProductPage } from "../../pages/product";
import Footer from "./footer";
import { useQuery, useQueryClient } from "react-query";
import { getAllProduct } from "../../service/product-service";
import { getAllReviews } from "../../service/reviews";
import { NoData } from "../../pages/no-data";
import { useEffect, useState } from "react";
import ContentLoader from 'react-content-loader'
import LoaderPage from "../../pages/loader";
import { useAtom } from "jotai";
import { loaderAtom } from "../../atom/loadingAtom";

export const AppLayout = () => {

    const [sortOption, setSortOption] = useState('ATOZ');
    const [loadingState, setLoadingState] = useAtom(loaderAtom);
    const queryClient = useQueryClient();

    const { data: productDataPublic, isLoading } = useQuery(
        ['product-data-public', sortOption],
        () => getAllProduct(sortOption || 'ATOZ'),
    );

    const handleSortSelect = (e: string) => {
        setSortOption(e)
        queryClient.invalidateQueries('product-data-public');
    }

    const { data: reviewsDataPublic } = useQuery(
        ['reviews-data'],
        () => getAllReviews('ATOZ'),
    );

    useEffect(() => {
        if (isLoading) {
            setLoadingState(true);
            setTimeout(() => {
                localStorage.setItem('userFirstVisit', '1');
            }, 5500);
        } else {
            setTimeout(() => {
                setLoadingState(false);
            }, 5000);
        }
    }, [isLoading]);

    return (
        <>
        {
            loadingState && localStorage.getItem('userFirstVisit') !== '1' ?
            <LoaderPage />
            :
            <div className='mainDiv w-full h-full flex flex-col'>
                
                <div className='w-full h-full'>
                    <div className='sticky top-0 z-50 drop-shadow-md shadow-black bg-[#f3efef]'>
                        <TopBar />
                    </div>
                    <main className='grow h-auto min-h-[100dvh]'>
                        <div className='w-full h-full'>
                            <SlideShow />
                        </div>
                        <div className='w-full h-full bg-[#f4f6f7]'>
                            <div className='flex justify-center items-center p-12'>
                                <div className='mt-4 flex flex-col justify-center items-center max-sm:mt-0'>
                                    <h1 className='font-black text-7xl tracking-tighter text-center max-sm:text-2xl'>WATCH YOUR STYLE EVOLVE</h1>
                                    <p className='flex text-center py-4 text-xl max-sm:text-sm'>Explore unparalleled elegance and precision in our collection of watches. Where sophistication meets technology, elevate every moment with timeless style. Browse now for the epitome of class and clarity.</p>
                                </div>
                            </div>
                        </div>
                        <div id='product-section' className='w-full h-full bg-white pl-20 pr-20 pb-20 pt-10 max-sm:pl-10 max-sm:pr-10 max-sm:pb-10'>
                            <div className='w-full h-full flex justify-end items-end max-sm:justify-start max-sm:items-start'>
                                {
                                    productDataPublic?.productData ? 
                                    <div className='w-full flex justify-end items-end gap-2'>
                                        <div className="relative h-10 w-48 min-w-[100px]">
                                            <select
                                                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-[#63B38F] focus:border-2 focus:border-[#63B38F] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                                                <option value='Watch'>Watch</option>
                                            </select>
                                            <label
                                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#63B38F] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-[#63B38F] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#63B38F] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                CATEGORY
                                            </label>
                                        </div>
                                        <div className="relative h-10 w-48 min-w-[100px]">
                                            <select
                                                onChange={(e) => handleSortSelect(e.target.value)}
                                                value={sortOption}
                                                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-[#63B38F] focus:border-2 focus:border-[#63B38F] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                                                <option value='ATOZ'>A -&gt; Z</option>
                                                <option value='ZTOA'>Z -&gt; A</option>
                                                <option value='PRICE_LOW_TO_HIGH'>Price Low to High</option>
                                                <option value='PRICE_HIGH_TO_LOW'>Price High to Low</option>
                                            </select>
                                            <label
                                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#63B38F] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-[#63B38F] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#63B38F] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                SORT LIST BY
                                            </label>
                                        </div>
                                    </div>
                                    :
                                        null
                                }
                            </div>
                            <div className='mt-12 grid 2xl:grid-cols-5 lg:grid-cols-4 gap-6 max-sm:grid-cols-1'>
                                {isLoading ? (
                                    <div className='col-span-full text-center flex justify-center items-center w-full h-full'>
                                        <ContentLoader backgroundColor="#dddcdc" viewBox="0 0 380 100">  
                                            <rect x="0" y="0" rx="2" ry="2" width="72" height="100" />
                                            <rect x="77" y="0" rx="2" ry="2" width="72" height="100" />
                                            <rect x="152" y="0" rx="2" ry="2" width="72" height="100" />
                                            <rect x="227" y="0" rx="2" ry="2" width="72" height="100" />
                                            <rect x="302" y="0" rx="2" ry="2" width="72" height="100" />
                                        </ContentLoader>
                                    </div>
                                ) : (
                                    productDataPublic?.productData ? (
                                        productDataPublic.productData.map((product, key) => {
                                            const productReviews = reviewsDataPublic?.reviewsData
                                                ? reviewsDataPublic.reviewsData
                                                    .filter(review => review.productId === product.productId)
                                                    .map(review => ({
                                                        reviewsId: review.reviewsId,
                                                        productId: review.productId,
                                                        reviewsName: review.reviewsName,
                                                        reviewsSubject: review.reviewsSubject,
                                                        reviewsMessage: review.reviewsMessage,
                                                        reviewsStarRating: review.reviewsStarRating,
                                                        createdAt: parseInt(review.createdAt),
                                                    })) ?? []
                                                : [];
                                                
                                            return (
                                                <div key={key}>
                                                    <ProductPage
                                                        productId={product.productId}
                                                        productName={product.productName}
                                                        img={product.img}
                                                        discount={product.discount}
                                                        originalPrice={product.originalPrice}
                                                        discountedPrice={product.discountedPrice}
                                                        description1={product.description1}
                                                        description2={product.description2}
                                                        originalQuantity={product.originalQuantity}
                                                        currentQuantity={product.currentQuantity}
                                                        productStatus={product.productStatus}
                                                        productSold={product.productSold}
                                                        productReviews={productReviews}
                                                        productFreebies={product.productFreebies}
                                                    />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className='col-span-6 row-span-8 text-center flex justify-center items-center w-full h-full'>
                                            <NoData />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <Outlet />
                    </main>
                    <div>
                        <Footer />
                    </div>
                </div>
            </div>
        }
        </>
    )
}
