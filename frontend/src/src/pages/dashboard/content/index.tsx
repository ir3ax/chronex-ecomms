import { useAtomValue } from "jotai"
import { contentAtom } from "../../../atom/contentAtom"
import { DashboardContent } from "./dashboard-content";
import { ProductContent } from "./product-content";
import { ReviewsContent } from "./reviews-content";
import { OrderContent } from "./order-content";
import { FreebiesContent } from "./freebies-content";
import { GenerateReportContent } from "./generate-report";
import { HomeImagesContent } from "./home-images";


export const MainContent = () => {

    const contentAtomValue = useAtomValue(contentAtom);
    
    return (
        <div className='w-full h-full bg-[#f9fbfc]'>
            {
                contentAtomValue === 'Dashboard' ?
                <DashboardContent />
                :
                contentAtomValue === 'Product' ?
                <ProductContent />
                :
                contentAtomValue === 'Freebies' ?
                <FreebiesContent />
                :
                contentAtomValue === 'Reviews' ?
                <ReviewsContent />
                :
                contentAtomValue === 'Images' ?
                <HomeImagesContent />
                :
                contentAtomValue === 'Report' ?
                <GenerateReportContent />
                :
                <OrderContent />
            }       
        </div>
    )
}