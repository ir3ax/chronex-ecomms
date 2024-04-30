import { useEffect } from "react";
import { useAtom } from "jotai";
import { LuLayoutDashboard } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import { IoStarHalfOutline } from "react-icons/io5";
import { GoGift } from "react-icons/go";
import { contentAtom } from "../../../atom/contentAtom";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
import { BsCart } from "react-icons/bs";
import { PiImagesLight } from "react-icons/pi";

export const DashboardSideBar = () => {

  const [contentAtomValue, setContentAtomValue] = useAtom(contentAtom);
  const emailAdmin = localStorage.getItem('userAdminEmail');

  const sidebarData = [
    {
      icons: <LuLayoutDashboard className='w-6 h-6' />,
      name: "Dashboard",
    },
    {
      icons: <TfiPackage className='w-6 h-6' />,
      name: "Product",
    },
    {
      icons: <GoGift className='w-6 h-6' />,
      name: "Freebies",
    },
    {
      icons: <BsCart className='w-6 h-6' />,
      name: "Orders",
    },
    {
      icons: <IoStarHalfOutline className='w-6 h-6' />,
      name: "Reviews",
    },
    {
      icons: <PiImagesLight className='w-6 h-6' />,
      name: "Images",
    },
    {
      icons: <RiFileExcel2Line className='w-6 h-6' />,
      name: "Report",
    },
  ];

  useEffect(() => {
    setContentAtomValue(sidebarData[0].name);
  }, []);

  return (
    <nav className='w-full h-full flex'>
      <div className='flex flex-col items-center w-full'>
        <div className='mt-16 mb-16 flex flex-col gap-2 justify-center items-center w-full'>
          <div className='w-24 h-24 rounded-full bg-[#e8fdf4] flex justify-center items-center'>
            <IoPersonCircleSharp className='w-20 h-20 text-[#172539]' />
          </div>
          <span className='text-[12px] text-gray-700'>{emailAdmin}</span>
        </div>
        <div className='w-full ml-8'>
          {sidebarData.map((item, index) => (
            <button
              onClick={() => setContentAtomValue(item.name)}
              key={index}
              className={`w-full flex justify-start items-start gap-4 p-4 ${contentAtomValue === item.name ? 'text-[#63B38F]' : 'text-[#c9c7c7]'} hover:text-[#63B38F] active:text-[#63B38F] focus:text-[#63B38F]`}
            >
              {item.icons}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
