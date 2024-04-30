import PrivacyPolicyImg from '../../assets/utilities/privacyPolicy.png';
import Footer from '../../components/appLayout/footer';
import { TopBar } from '../../components/appLayout/topbar';

const PrivacyPolicy = () => {
      
	return (
		<div className='w-full h-full'>
			<div className='sticky top-0 z-50 drop-shadow-md shadow-black bg-[#f3efef]'>
                <TopBar />
            </div>
			<div className='bg-white flex justify-center items-center flex-col'>
				<div className='bg-white relative w-full h-[50vh] flex justify-center items-center'>
					<img className='object-cover w-full h-full' src={PrivacyPolicyImg}/>
					<span className='absolute font-bold text-white text-[60px] max-sm:text-[42px] text-center tracking-wider'>Privacy Policy</span>
				</div>
				<div className='bg-white relative w-full h-full pl-24 pr-24 max-sm:pl-8 max-sm:pr-8 tracking-wider mt-16 text-lg max-sm:text-sm'>
					<p className='font-bold text-[#403E3C]'>Introduction</p>
					<p className='mt-5'>This Privacy Policy describes how Chronex, and its subsidiaries and affiliates globally ("Chronex"), may collect, use, and disclose personal information of site visitors who access or use our Web app or our websites that link to this Privacy Policy for the services offered from various Chronex platforms.</p>
					<p className='mt-10 font-bold text-[#403E3C]'>Collection Of Information</p>
					<p className='mt-5'>When you visit or use Chronex services, Chronex may obtain certain personal information from you, such as:</p>
					<p className='mt-4'>Name, addresses, contact numbers, and email addresses; records of your orders and other transactions with Chronex, Account information in association with billing address(es), even code(s) and expiration date(s). Exact location and previously visited locations will be stored.</p>
					<p className='mt-10 font-bold text-[#403E3C]'>Confidentiality:</p>
					<p className='mt-2'>"Our customer service team is bound by strict confidentiality rules. They are not allowed to disclose personal information to the buyer or any unauthorized parties."</p>
					<p className='mt-6'>Chronex may periodically conduct voluntary surveys. Should you choose to participate, Chronex will also collect and store the information you have provided. You must have the consent of the person whose information you are inputting into any of Chronex's services platforms. By completing the required information, you are consenting that you have approval from the person; if not, you must obtain it.</p>
					<p className='mt-4'>Chronex may collect certain information about you automatically when you visit or use our online services. This information may include your IP address, device, browser, language preference, URLs, length of visits, and pages viewed. Chronex automatically collects information using various technologies and third parties. Cookies and web server logs may be stored on your computer. Please be aware that disabling cookies may affect our services to you.</p>
                    <p className='mt-4'>Depending on your device and app permission settings, when using Chronex’s website, we may collect or have access to your precise geolocation, camera, and Wi-Fi connection information. You may opt-out of granting permission, but the services Chronex provides will depend on you granting access.</p>
                    <p className='mt-4'>You have the right to request that we disclose certain information to you about our collection and use of your personal information within 6 months. You also have the right to request Chronex to delete the personal information about you that we collected and retained.</p>
                    <p className='mt-10'>For more information or questions on Chronex Privacy Policy, please contact us at <a className='italic text-gray-600 hover:underline' href='mailto:chronex.ecomms@gmail.com'>chronex.ecomms@gmail.com</a></p>
                </div>
			</div>
			<div className='mt-24'>
				<Footer />
			</div>
		</div>
	);

};

export default PrivacyPolicy;