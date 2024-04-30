import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { useQuery } from 'react-query';
import { getAllOrder, getAllOrderRevenue, getAllTotalOrder, getBestSellingProducts } from '../../../../service/order';
import { TbArrowBadgeDownFilled, TbArrowBadgeUpFilled } from "react-icons/tb";
import { getCurrentMonth } from '../../../../utility/common';
import { getAllProduct } from '../../../../service/product-service';
import { getAllFreebies } from '../../../../service/freebies';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useAtom } from 'jotai';
import { activeTabAtom, contentAtom } from '../../../../atom/contentAtom';
interface MonthDataRevenue {
    month: string;
    count: number; // Assuming count is of type number
}

type BestSellingProduct = {
    product_id: string;
    product_name: string;
    total_sales: number;
    total_order_quantity: number;
};

interface ProductDataItem {
    productName: string;
    totalExpenses: number;
}

interface FreebiesDataItem {
    freebiesName: string;
    freebiesTotalExpenses: number;
  }

export const DashboardContent = () => {

    const [, setContentAtomValue] = useAtom(contentAtom);
    const [, setActiveTab] = useAtom(activeTabAtom);

    const [currentMonthData, setCurrentMonthData] = useState<MonthDataRevenue[]>([]);
    const [previousMonthData, setPreviousMonthData] = useState<MonthDataRevenue[]>([]);

    const [currentMonthDataTotalQuantity, setCurrentMonthDataTotalQuantity ] = useState<MonthDataRevenue[]>([]);
    const [previousMonthDataTotalQuantity, setPreviousMonthDataTotalQuantity ] = useState<MonthDataRevenue[]>([]);

    const { data: orderDataRevenue } = useQuery(
        ['order-data-revenue'],
        () => getAllOrderRevenue("DLV"),
    );

    useEffect(() => {
        if(orderDataRevenue){
            // Parse JSON data fetched from the server
            const currentData = JSON.parse(orderDataRevenue.currentData);
            const previousData = JSON.parse(orderDataRevenue.previousData);

            // Map data to the appropriate format
            const currentMonth: MonthDataRevenue[] = Object.entries(currentData).map(([date, total]) => ({
                month: date.split('-')[2], // Extract day from date
                count: total as number, // Assert total as number
            }));

            const previousMonth: MonthDataRevenue[] = Object.entries(previousData).map(([date, total]) => ({
                month: date.split('-')[2], // Extract day from date
                count: total as number, // Assert total as number
            }));

            // Set state values
            setCurrentMonthData(currentMonth);
            setPreviousMonthData(previousMonth);
        }
    }, [orderDataRevenue]);

    useEffect(() => {
        if(orderDataRevenue){
            initializeChartRevenue();
        }
    }, [currentMonthData, previousMonthData]);

    const initializeChartRevenue = () => {
        const labels = currentMonthData.map(row => row.month);
        const currentMonthCounts = currentMonthData.map(row => row.count);
        const previousMonthCounts = previousMonthData.map(row => row.count);

        const chartElement = document.getElementById('acquisitions') as HTMLCanvasElement | null;
        if (chartElement instanceof HTMLCanvasElement && chartElement) {
            // If chart already exists, destroy it first
            const existingChart = Chart.getChart(chartElement);
            if (existingChart) {
                existingChart.destroy();
            }

            new Chart(chartElement, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Current Month',
                            data: currentMonthCounts,
                            borderColor: '#7BCB79',
                            fill: false
                        },
                        {
                            label: 'Previous Month',
                            data: previousMonthCounts,
                            borderColor: '#C75212',
                            fill: false
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    //Total Revenue
    const totalCountCurrent = currentMonthData.reduce((total, data) => total + data.count, 0);
    const totalCountPrevious = previousMonthData.reduce((total, data) => total + data.count, 0);
    const percentageChange = totalCountPrevious !== 0
        ? ((totalCountCurrent - totalCountPrevious) / totalCountPrevious) * 100
        : 0;
    const revenueChangeIndicator = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'unchanged';

    //Total Order
    const { data: orderTotalQuantity } = useQuery(
        ['order-data-quantity'],
        () => getAllTotalOrder("DLV"),
    );

    useEffect(() => {
        if(orderTotalQuantity){
            // Parse JSON data fetched from the server
            const currentData = JSON.parse(orderTotalQuantity.currentData);
            const previousData = JSON.parse(orderTotalQuantity.previousData);

            // Map data to the appropriate format
            const currentMonth: MonthDataRevenue[] = Object.entries(currentData).map(([date, total]) => ({
                month: date.split('-')[2], // Extract day from date
                count: total as number, // Assert total as number
            }));

            const previousMonth: MonthDataRevenue[] = Object.entries(previousData).map(([date, total]) => ({
                month: date.split('-')[2], // Extract day from date
                count: total as number, // Assert total as number
            }));

            // Set state values
            setCurrentMonthDataTotalQuantity(currentMonth);
            setPreviousMonthDataTotalQuantity(previousMonth);
        }
    }, [orderTotalQuantity]);


    useEffect(() => {
        if (orderTotalQuantity) {
            initializeChartOrdersQuantity();
        }
    }, [currentMonthDataTotalQuantity, previousMonthDataTotalQuantity]);
    
    const initializeChartOrdersQuantity = () => {
        const labels = currentMonthDataTotalQuantity.map(row => row.month); // Use currentMonthDataTotalQuantity for labels
        const currentMonthCounts = currentMonthDataTotalQuantity.map(row => row.count);
        const previousMonthCounts = previousMonthDataTotalQuantity.map(row => row.count);
    
        const chartElement = document.getElementById('acquisitions2') as HTMLCanvasElement | null;
        if (chartElement instanceof HTMLCanvasElement && chartElement) {
            // If chart already exists, destroy it first
            const existingChart = Chart.getChart(chartElement);
            if (existingChart) {
                existingChart.destroy();
            }
    
            new Chart(chartElement, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Current Month',
                            data: currentMonthCounts,
                            borderColor: '#7BCB79',
                            fill: false
                        },
                        {
                            label: 'Previous Month',
                            data: previousMonthCounts,
                            borderColor: '#C75212',
                            fill: false
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };
    

    const totalCountCurrentTotalQuantity = currentMonthDataTotalQuantity.reduce((total, data) => total + data.count, 0);
    const totalCountPreviousTotalQuantity = previousMonthDataTotalQuantity.reduce((total, data) => total + data.count, 0);
    const percentageChangeTotalQuantity = totalCountPreviousTotalQuantity !== 0
        ? ((totalCountCurrentTotalQuantity - totalCountPreviousTotalQuantity) / totalCountPreviousTotalQuantity) * 100
        : 0;
    const revenueChangeIndicatorTotalQuantity = percentageChangeTotalQuantity > 0 ? 'up' : percentageChangeTotalQuantity < 0 ? 'down' : 'unchanged';


    //Best Selling
    const { data: bestSellingProductsData } = useQuery(
        ['best-selling-data'],
        () => getBestSellingProducts("DLV"),
    );

    const bestSellingProducts = bestSellingProductsData && JSON.parse(bestSellingProductsData.bestSellingProducts);

    //Total Spent
    const [totalExpensesData, setTotalExpensesData] = useState<ProductDataItem[]>([]);
    const [totalExpensesDataFreebies, setTotalExpensesDataFreebies] = useState<FreebiesDataItem[]>([]);

    const { data: productData } = useQuery(
        ['product-data'],
        () => getAllProduct('ATOZ'),
    );

    useEffect(() => {
        if (productData && productData.productData) {
            const totalExpenses = productData.productData.map(product => ({
                productName: product.productName,
                totalExpenses: product.supplierPrice * product.originalQuantity
            }));
        
            setTotalExpensesData(totalExpenses || []);
        }
    }, [productData]);

    const { data: freebiesData } = useQuery(
        ['freebies-data'],
        () => getAllFreebies('ATOZ'),
    );

    useEffect(() => {
        if (freebiesData && freebiesData.freebiesData) {
            const totalExpensesFreebies = freebiesData.freebiesData.map(freebies => ({
                freebiesName: freebies.freebiesName,
                freebiesTotalExpenses: freebies.freebiesStorePrice * freebies.freebiesOriginalQuantity
            }))
            .filter(item => !isNaN(item.freebiesTotalExpenses) && item.freebiesTotalExpenses !== 0);
        
            setTotalExpensesDataFreebies(totalExpensesFreebies || []);
        }
    }, [freebiesData]);

    // Calculate the overall total expenses
    const overallTotalExpenses =
    totalExpensesData.reduce((acc, curr) => acc + (curr.totalExpenses || 0), 0) +
    totalExpensesDataFreebies.reduce((acc, curr) => acc + (curr.freebiesTotalExpenses || 0), 0);
    const totalExpensesDefined = totalExpensesData.length > 0 || totalExpensesDataFreebies.length > 0;
    const overallTotalExpensesDisplay = totalExpensesDefined ? overallTotalExpenses : 0;

    //Order Status
    //Pending
    const { data: orderDataPending } = useQuery(
        ['pending-order-data'],
        () => getAllOrder('ATOZ', undefined , "PEN"),
    );
    //Active
    const { data: orderDataActive } = useQuery(
        ['active-order-data'],
        () => getAllOrder('ATOZ', undefined , "ACT"),
    );
    //Shipped
    const { data: orderDataShipped } = useQuery(
        ['shipped-order-data'],
        () => getAllOrder('ATOZ', undefined , "SHP"),
    );
    //Delivered
    const { data: orderDataDelivered } = useQuery(
        ['delivered-order-data'],
        () => getAllOrder('ATOZ', undefined , "DLV"),
    );
    //Cancelled
    const { data: orderDataCancelled } = useQuery(
        ['cancelled-order-data'],
        () => getAllOrder('ATOZ', undefined , "CAN"),
    );
    
    return (
        <div className='dashboard w-full h-full bg-[#f9fbfc]'>
            <div className='w-full h-full flex flex-col gap-5'>
                <div className='w-full flex gap-4'>
                    <div className='flex flex-col gap-4 w-full h-full border p-4 rounded-md bg-[#1D2E44]'>
                        <div className='text-white w-full flex flex-col justify-center items-center'>
                            <span className='text-lg'>Total Revenue</span>
                            <div className='w-full flex justify-center items-center gap-4'>
                                <span className='text-4xl'>₱{totalCountCurrent.toFixed(2)}</span>
                                <div className='mt-1 flex flex-col'>
                                    <div className={`relative w-[30%] pl-2 pr-12 text-sm ${revenueChangeIndicator === 'up' ? 'bg-[#1F474C] text-[#259C5B]' : revenueChangeIndicator === 'down' ? 'bg-red-900 text-red-400' : 'bg-[#1F474C] text-[#259C5B]'} flex`}>
                                        {revenueChangeIndicator === 'up' && <TbArrowBadgeUpFilled className='absolute mt-[2px] right-0 w-4 h-4 text-[#259C5B]' />}
                                        {revenueChangeIndicator === 'down' && <TbArrowBadgeDownFilled className='absolute mt-[2px] right-0 w-4 h-4 text-red-400' />}
                                        {revenueChangeIndicator === 'unchanged' && <span className='absolute mt-[2px] right-0 w-4 h-4 text-gray-300'>-</span>}
                                        {percentageChange.toFixed(0)}%
                                    </div>
                                    <span className='text-[11px] text-gray-300'>vs previous period<span className='text-orange-500'>(₱{totalCountPrevious.toFixed(2)})</span></span>
                                </div>
                            </div>
                        </div>
                        <div className='w-full'><canvas id='acquisitions'></canvas></div>
                    </div>
                    <div className='w-full h-full border p-4 rounded-md bg-[#1D2E44]'>
                        <div className='text-white w-full flex flex-col justify-center items-center'>
                            <span className='text-lg'>Total Order</span>
                            <div className='w-full flex justify-center items-center gap-4'>
                                <span className='text-4xl'>{totalCountCurrentTotalQuantity}</span>
                                <div className='mt-1 flex flex-col'>
                                    <div className={`relative w-[30%] pl-2 pr-12 text-sm ${revenueChangeIndicatorTotalQuantity === 'up' ? 'bg-[#1F474C] text-[#259C5B]' : revenueChangeIndicatorTotalQuantity === 'down' ? 'bg-red-900 text-red-400' : 'bg-[#1F474C] text-[#259C5B]'} flex`}>
                                        {revenueChangeIndicatorTotalQuantity === 'up' && <TbArrowBadgeUpFilled className='absolute mt-[2px] right-0 w-4 h-4 text-[#259C5B]' />}
                                        {revenueChangeIndicatorTotalQuantity === 'down' && <TbArrowBadgeDownFilled className='absolute mt-[2px] right-0 w-4 h-4 text-red-400' />}
                                        {revenueChangeIndicatorTotalQuantity === 'unchanged' && <span className='absolute mt-[2px] right-0 w-4 h-4 text-gray-300'>-</span>}
                                        {percentageChangeTotalQuantity.toFixed(0)}%
                                    </div>
                                    <span className='text-[11px] text-gray-300'>vs previous period<span className='text-orange-500'>({totalCountPreviousTotalQuantity})</span></span>
                                </div>
                            </div>
                        </div>
                        <div className='w-full'><canvas id='acquisitions2'></canvas></div>
                    </div>
                </div>
                <div className='w-full h-full flex gap-6'>
                    <div className='w-full h-full min-h-[400px] max-h-[600px] overflow-auto border p-4 rounded-md bg-[#1D2E44]'>
                        <div className='w-full h-full flex flex-col'>
                            <div className='font-semibold text-[#848D96] tracking-widest'>
                                Month - ( {getCurrentMonth()} )
                            </div>
                            <div className='font-semibold text-white flex justify-center items-center'>
                                Best Selling Products
                            </div>
                            <div className='mt-4 w-full h-full flex flex-col'>
                                <div className='w-full flex text-[#848D96]'>
                                    <p className='w-[10%] flex justify-center'>#</p>
                                    <p className='w-[45%] flex justify-center'>Product</p>
                                    <p className='w-[25%] flex justify-center border-r border-gray-600'>Sales</p>
                                    <p className='w-[18%]  flex justify-center'>Orders</p>
                                </div>
                                <div className='mt-1 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                {/* Map best selling products */}
                                {bestSellingProducts && bestSellingProducts.map((product: BestSellingProduct, index: number) => (
                                    <>
                                        <div key={index} className='w-full flex text-[#dee2e6]'>
                                            <p className='w-[10%] flex justify-center items-center text-[#848D96]'>{index + 1}</p>
                                            <p className='w-[45%] flex justify-start items-start text-[13px]'>{product.product_name}</p>
                                            <p className='w-[25%] flex justify-center items-center border-r border-gray-600 font-semibold text-lg'>₱ {product.total_sales.toFixed(2)}</p>
                                            <p className='w-[18%] flex justify-center items-center font-semibold text-lg'>{product.total_order_quantity}</p>
                                        </div>
                                        <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-full min-h-[400px] max-h-[600px] overflow-auto border p-4 rounded-md bg-[#1D2E44]'>
                        <div className='w-full h-full flex flex-col'>
                            <div className='font-semibold text-white flex justify-center items-center'>
                               Total Spent
                            </div>
                            <div className='font-semibold text-[#848D96] tracking-widest'>
                                Total:
                                <span className='text-orange-500 font-thin'> ( ₱ {overallTotalExpensesDisplay.toFixed(2)} )</span>
                            </div>
                            <div className='mt-4 w-full h-full flex flex-col'>
                                <div className='w-full flex text-[#848D96]'>
                                    <p className='w-[65%] flex justify-center border-r border-gray-600'>Product</p>
                                    <p className='w-[25%]  flex justify-center'>Value</p>
                                </div>
                                <div className='mt-1 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                {totalExpensesData && totalExpensesData.map((product: ProductDataItem, index: number) => (
                                    <>
                                        <div key={index} className='w-full flex text-[#dee2e6]'>
                                            <p className='w-[65%] flex justify-start items-start text-[13px] border-r border-gray-600'>{product.productName}</p>
                                            <p className='w-[25%] flex justify-center items-center font-semibold text-lg'>₱ {product.totalExpenses.toFixed(2)}</p>
                                        </div>
                                        <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                    </>
                                ))}
                                 {totalExpensesDataFreebies && totalExpensesDataFreebies.map((freebies: FreebiesDataItem, index: number) => (
                                    <>
                                        <div key={index} className='w-full flex text-[#dee2e6]'>
                                            <p className='w-[65%] flex justify-start items-start text-[13px] border-r border-gray-600'>{freebies.freebiesName}</p>
                                            <p className='w-[25%] flex justify-center items-center font-semibold text-lg'>₱ {freebies.freebiesTotalExpenses.toFixed(2)}</p>
                                        </div>
                                        <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-full min-h-[400px] max-h-[600px] overflow-auto border p-4 rounded-md bg-[#1D2E44]'>
                        <div className='w-full h-full flex flex-col'>
                            <div className='font-semibold text-white flex justify-center items-center'>
                               Order Status
                            </div>
                            <div className='mt-10 w-full h-full flex flex-col'>
                                <div className='w-full flex text-[#848D96]'>
                                    <p className='w-[45%] flex justify-center border-r border-gray-600'>Status</p>
                                    <p className='w-[45%]  flex justify-center'>Number</p>
                                    <p className='w-[15%]'></p>
                                </div>
                                <div className='mt-1 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                <>
                                    <div className='w-full flex text-[#CF7316]'>
                                        <p className='w-[45%] flex justify-center items-center text-[13px] border-r border-gray-600'>PENDING</p>
                                        <p className='w-[45%] flex justify-center items-center font-semibold text-lg'> {orderDataPending?.orderData?.length === undefined ? 0 : orderDataPending?.orderData?.length}</p>
                                        <button onClick={() => { setContentAtomValue('Orders'); setActiveTab('pending'); }} className='w-[15%] border-l flex justify-center border-gray-600'><MdOutlineKeyboardDoubleArrowRight className='w-6 h-6 hover:border-b-2 hover:border-[#FF7F20]'/></button>
                                    </div>
                                    <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                </>
                                <>
                                    <div className='w-full flex text-[#519c47]'>
                                        <p className='w-[45%] flex justify-center items-center text-[13px] border-r border-gray-600'>ACTIVE</p>
                                        <p className='w-[45%] flex justify-center items-center font-semibold text-lg'> {orderDataActive?.orderData?.length === undefined ? 0 : orderDataActive?.orderData?.length}</p>
                                        <button onClick={() => { setContentAtomValue('Orders'); setActiveTab('active'); }} className='w-[15%] border-l flex justify-center border-gray-600'><MdOutlineKeyboardDoubleArrowRight className='w-6 h-6 hover:border-b-2 hover:border-[#519c47]'/></button>
                                    </div>
                                    <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                </>
                                <>
                                    <div className='w-full flex text-[#c2b85f]'>
                                        <p className='w-[45%] flex justify-center items-center text-[13px] border-r border-gray-600'>SHIPPED</p>
                                        <p className='w-[45%] flex justify-center items-center font-semibold text-lg'> {orderDataShipped?.orderData?.length === undefined ? 0 : orderDataShipped?.orderData?.length}</p>
                                        <button onClick={() => { setContentAtomValue('Orders'); setActiveTab('shipped'); }} className='w-[15%] border-l flex justify-center border-gray-600'><MdOutlineKeyboardDoubleArrowRight className='w-6 h-6 hover:border-b-2 hover:border-[#c2b85f]'/></button>
                                    </div>
                                    <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                </>
                                <>
                                    <div className='w-full flex text-[#4c8cc0]'>
                                        <p className='w-[45%] flex justify-center items-center text-[13px] border-r border-gray-600'>DELIVERED</p>
                                        <p className='w-[45%] flex justify-center items-center font-semibold text-lg'> {orderDataDelivered?.orderData?.length === undefined ? 0 : orderDataDelivered?.orderData?.length}</p>
                                        <button onClick={() => { setContentAtomValue('Orders'); setActiveTab('delivered'); }} className='w-[15%] border-l flex justify-center border-gray-600'><MdOutlineKeyboardDoubleArrowRight className='w-6 h-6 hover:border-b-2 hover:border-[#4c8cc0]'/></button>
                                    </div>
                                    <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                </>
                                <>
                                    <div className='w-full flex text-[#c56464]'>
                                        <p className='w-[45%] flex justify-center items-center text-[13px] border-r border-gray-600'>CANCELLED</p>
                                        <p className='w-[45%] flex justify-center items-center font-semibold text-lg'> {orderDataCancelled?.orderData?.length === undefined ? 0 : orderDataCancelled?.orderData?.length}</p>
                                        <button onClick={() => { setContentAtomValue('Orders'); setActiveTab('cancelled'); }} className='w-[15%] border-l flex justify-center border-gray-600'><MdOutlineKeyboardDoubleArrowRight className='w-6 h-6 hover:border-b-2 hover:border-[#c56464]'/></button>
                                    </div>
                                    <div className='mt-2 mb-4 h-[1px] bg-gray-600 w-full'></div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
