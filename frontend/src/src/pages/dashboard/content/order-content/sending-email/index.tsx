import { Modal } from '../../../../../components/modal';
import { toast } from 'react-toastify';
import { sendEmail } from '../../../../../service/email-sending';
import { SiMinutemailer } from 'react-icons/si';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    email: string;
    firstName: string;
}

export const ModalSendingEmail = (props: Xprox) => {

    const notify = () => toast("Email Successfully Sent!");

    const sendShipEmail = () => {
        const emailBodyShipped = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                 @font-face {
                    font-family: 'Perpetua Regular';
                    src: url('path/to/perpetua-regular.ttf') format('truetype'); /* Adjust the path and format */
                    /* You can also provide additional font formats (woff, woff2, etc.) for better cross-browser compatibility */
                }
        
                body {
                    margin: 0 auto;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    height:100%;
                    width: 100%;
                }
                .holder1{
                    margin: 0 auto;
                    padding: 0;
                    height:100%;
                    width: 100%;
                    background-color: white ;
                }
                .holder2{
                    margin: 0 auto;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    padding-top: 40px;
                    padding-bottom: 40px;
                    background-color: #F3F4F8;
                }
                .headerHolder{
                    margin: 0 auto;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    align-items: center;
                    padding-bottom: 10px;
                }
                .header {
                    width: 60%;
                    height: 100%;
                }
                .body {
                    text-align: start;
                    margin:0 auto;
                    padding:0;
                    padding: 21px;
                    background-color:white;
                    width: 51%;
                    overflow: auto;
                }
                p{
                    color:rgb(20, 20, 20);
                    letter-spacing: 0.1em;
                }
                span{
                    color:black;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                }
                strong{
                    color:black;
                    letter-spacing: 0.1em;
                }

                @media (max-width: 768px) {
                    /* Adjust the width for mobile devices */
                    .body {
                        width: 90%;
                        background-color: #F3F4F8;     
                    } 
                }
            </style>
        </head>
        <body>
        <div class="holder">
            <div class="holder2">
                <div class="body">
                    <div class="headerHolder">
                    <img class="header" src="https://chronex-bucket.s3.ap-southeast-1.amazonaws.com/CHRONEX-LOGO-bg.png" alt="Chronex Logo" />
                    </div>
                    <p>Hi <strong>${props.firstName}</strong>,</p>
                    <p>
                        <p>We are excited to inform you that your order has been shipped!</p>
                    </p>
                    <hr>
                    <p><strong>Estimated Delivery:</strong></p>
                    <div class="delivery-info">
                        <p>Your order is estimated to arrive within:</p>
                        <ul>
                            <li><strong>Luzon:</strong> 3-5 business days</li>
                            <li><strong>Visayas:</strong> 6-10 business days</li>
                            <li><strong>Mindanao:</strong> 8-14 business days</li>
                        </ul>
                    </div>
                    <hr>
                    <p>If you have any questions or concerns about your order, feel free to reply to this email or contact our customer service team at this contact number: 091124442234.</p>
                    <p>Thank you for choosing us!</p>
                </div>
            </div>
        </div>
        </body>
        </html>`

        sendEmail(props.email, "Your Order Has Shipped!", emailBodyShipped);
        notify()
        props.handleClose()
    }


    return (
      <Modal open={props.isVisible} onClose={props.handleClose}>
        <div className='flex flex-col justify-start w-[42rem] h-[22rem] bg-white p-8 overflow-auto'>
                <form className='w-full h-full'>
                  <div className='w-full h-full flex flex-col justify-center items-start'>
                    <div className='w-full flex flex-col justify-center items-center gap-6 p-12'>
                      <SiMinutemailer className='w-24 h-24 text-[#172539]' />
                      <span className='text-xl tracking-wide text-center'>Are you sure you want to send the <strong>"Order Has Shipped"</strong> email?</span>
                    </div>

                    <div className='w-full flex justify-end items-center gap-4'>
                      <button type='button' className='border pt-2 pb-2 pr-4 pl-4 bg-[#fcf8f7] text-black cursor-pointer hover:bg-[#dddada] rounded-md' onClick={props.handleClose}>CANCEL</button>
                      <button type='button' onClick={sendShipEmail} className='border pt-2 pb-2 pr-4 pl-4 bg-purple-800 text-white cursor-pointer hover:bg-purple-700 rounded-md'>SEND</button>
                    </div>
                  </div>
                </form>
        </div>
      </Modal>
    )
}

