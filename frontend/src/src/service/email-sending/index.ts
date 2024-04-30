import { axiosInstance } from "../axios";

export const sendEmail = async (to: string, subject: string, body: string) => {
    try {
        const emailData = {
            to: to,
            subject: subject,
            body: body
        };
        await axiosInstance.post(`send-email`, emailData);
        console.log("Email sent successfully!");   
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};