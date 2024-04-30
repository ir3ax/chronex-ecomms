import { MainContent } from "./content"
import { DashboardSideBar } from "./sidebar"
import { DashboardTopBar } from "./topbar"

export const Dashboard = () => {
    
    return (
        <div className='w-full h-full bg-[#f9fbfc] min-h-[100dvh]'>
            <div className='bg-[#172539] min-h-16'>
                <DashboardTopBar />
            </div>
            <div className='flex gap-4'>
                <div className='min-w-48 bg-[#ffffff] min-h-[100dvh]'>
                    <DashboardSideBar />
                </div>
                <div className='w-full min-w-96 bg-[#f9fbfc] min-h-[100dvh] p-12'>
                    <div className='w-full h-full'>
                        <MainContent />
                    </div>
                </div>
            </div>
            
        </div>
    )
}