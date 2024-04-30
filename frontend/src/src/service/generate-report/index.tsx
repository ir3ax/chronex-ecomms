import { axiosInstance } from "../axios";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const generateRevenue = async (month: number, year: number) => {
    try {
        if (month < 1 || month > 12) {
            console.error("Invalid month number.");
            return;
        }
        const monthName = monthNames[month - 1];

        const response = await axiosInstance.get(`generate-revenue?month=${month}&year=${year}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `revenue_data(${monthName}_${year}).xlsx`);
        document.body.appendChild(link);
        link.click();
        console.log("Generate successfully!");   
    } catch (error) {
        console.error("Failed to generate:", error);
    }
};

export const generateTotalOrder = async (month: number, year: number) => {
    try {
        if (month < 1 || month > 12) {
            console.error("Invalid month number.");
            return;
        }
        const monthName = monthNames[month - 1];

        const response = await axiosInstance.get(`generate-total-order?month=${month}&year=${year}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `total_order_data(${monthName}_${year}).xlsx`);
        document.body.appendChild(link);
        link.click();
        console.log("Generate successfully!");   
    } catch (error) {
        console.error("Failed to generate:", error);
    }
};

export const generateBestSelling = async (month: number, year: number) => {
    try {
        if (month < 1 || month > 12) {
            console.error("Invalid month number.");
            return;
        }
        const monthName = monthNames[month - 1];

        const response = await axiosInstance.get(`generate-best-selling?month=${month}&year=${year}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `best_selling_products(${monthName}_${year}).xlsx`);
        document.body.appendChild(link);
        link.click();
        console.log("Generate successfully!");   
    } catch (error) {
        console.error("Failed to generate:", error);
    }
};

export const generateTotalExpenses = async (month: number, year: number) => {
    try {
        if (month < 1 || month > 12) {
            console.error("Invalid month number.");
            return;
        }
        const monthName = monthNames[month - 1];
        
        const response = await axiosInstance.get(`generate-total-expenses?month=${month}&year=${year}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `total_expenses(${monthName}_${year}).xlsx`);
        document.body.appendChild(link);
        link.click();
        console.log("Generate successfully!");   
    } catch (error) {
        console.error("Failed to generate:", error);
    }
};