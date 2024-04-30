import { TableHead, TableRow, TableHeader } from "../../../components/ui/table"


export const TableHeaders : React.FC = () => {
    
    
    return (
       <TableHeader className='w-full text-[14px] max-sm:hidden'>
            <TableRow>
                <TableHead className='flex justify-start items-center w-[100%] gap-2'>
                   <span className="flex text-lg font-normal">Product Image</span>    
                </TableHead>

                <TableHead className='flex justify-center items-center w-[100%] gap-2'>
                    <span className="flex text-lg font-normal">Product Name</span>
                </TableHead>

                <TableHead className='flex justify-center items-center w-[100%] gap-2'>
                    <span className="flex text-lg font-normal">Quantity</span>
                </TableHead>

                <TableHead className='flex justify-center items-center w-[100%] gap-2'>
                    <span className="flex text-lg font-normal">Price</span>
                </TableHead>

                <TableHead className='flex justify-center items-center w-[100%] gap-2'>
                    <span className="flex text-lg font-normal">Total</span>
                </TableHead>

                <TableHead className='flex justify-end items-center w-[100%]'>
                    <span className="flex text-lg font-normal mr-24">Action</span>
                </TableHead>
            </TableRow>
       </TableHeader>
    )
}