import { NavLink } from "react-router-dom";
import FaceBook from "../../../assets/footer/facebook.svg";
// import Instagram from "../../../assets/footer/instagram.svg";
// import Twitter from "../../../assets/footer/twitter.svg";

const Footer = () => {

    const socialLinks = [
        {
            id: 1,
            src: FaceBook,
            link: 'https://www.facebook.com/chronex-sample',
        },
        // {
        //     id: 2,
        //     src: Instagram,
        //     link: '',
        // },
        // {
        //     id: 3,
        //     src: Twitter,
        //     link: 'https://www.linkedin.com/company/snaptoapp/',
        // },
    ];
  
    // const help = [
    //     {
    //         id: 1,
    //         title: 'Contact Us',
    //         link: '/contact-us',
    //     },
    // ];

	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

	return (
		<div className='max-sm:w-[100%] w-full absolute text-white  bg-[#2D2D2D] pb-[3%]'>
			<div className='grid md:grid-cols-3 grid-cols-1 gap-4 w-full h-full pt-[33px]'>
				<div className='w-full pl-[76px] grid content-start'>
					<span className='font-semibold'>Chronex</span>
					<div className='flex flex-row gap-2 mt-[11px] '>
						{socialLinks.map(({ id, src, link }) => (
							<div key={id}>
								<NavLink id='nav-link' to={link} target='_blank'>
									<img
										src={src}
										alt='Loading Image'
										className='w-[3vw] h-[3vw] min-w-[35px] min-h-[40px] hover:scale-125 duration-500'
									/>
								</NavLink>
							</div>
						))}
					</div>
				</div>
				{/* <div className='grid col-span-2 w-full grid-flow-row gap-8 sm:grid-flow-col sm:grid-cols-2 grid-cols-1 px-[76px] md:pl-[0px]  md:mt-[0px] sm:mt-[20px] mt-[29px]'>	
					<div className='w-full'>
						<span className='font-semibold'>Help</span>
						<div className='flex flex-col gap-2 mt-[11px]'>
							{help.map(({ id, title, link }) => (
								<div key={id}>
									<NavLink
										id='nav-link'
										to={link}
										className='hover:border-b-2 hover:border-[#FF7F20] text-[14px] font-thin'
									>
										{title}
									</NavLink>
								</div>
							))}
						</div>
					</div>
				</div> */}
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-4 w-full px-[76px] pt-[4%] sm:place-content-center'>
				<div className='font-thin mt-[20px] sm:mt-[0px] justify-start max-sm:justify-start flex'>
					<span>Copyright &copy; 2024 Chronex</span>
				</div>
				<div className='grid row-start-1 md:col-start-2 sm:justify-end grid-flow-col mt-[40px] sm:mt-[0px]'>
					<NavLink
						id='nav-link'
						to={'/termsofservice'}
						className='hover:border-b-2 hover:border-[#FF7F20] font-light'
						onClick={scrollToTop}
					>
						Terms of Service
					</NavLink>
					<span className='mx-5'>|</span>
					<NavLink
						id='nav-link'
						to={'/privacypolicy'}
						className='hover:border-b-2 hover:border-[#FF7F20] font-light'
						onClick={scrollToTop}
					>
						Privacy Policy
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default Footer;