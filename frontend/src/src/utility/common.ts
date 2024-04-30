import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const classNames = (...classes: string[]): string => {
	return classes.filter(Boolean).join(' ');
};

export const formatDate = (timestamp: number) => {
    // Convert Unix timestamp to milliseconds
    const milliseconds = timestamp * 1000;
    // Create a new Date object
    const dateObject = new Date(milliseconds);
    // Format the date as desired (e.g., "YYYY-MM-DD HH:MM:SS")
    const formattedDate = dateObject.toLocaleString(); // Adjust locale and options as needed
    return formattedDate;
};

export const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp * 1000) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + (interval === 1 ? "year" : "years") + " ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + (interval === 1 ? "month" : "months") + " ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + (interval === 1 ? "day" : "days") + " ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        // const remainingMinutes = Math.floor((seconds % 3600) / 60);
        return interval + (interval === 1 ? "hr" : "hrs") + " ago"; 
        // + remainingMinutes + (remainingMinutes === 1 ? "min" : "mins") + " ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + (interval === 1 ? "min" : "mins") + " ago";
    }
    return Math.floor(seconds) + (Math.floor(seconds) === 1 ? "second" : "seconds") + " ago";
}

interface Product {
    discountedPrice: number;
    productId: string;
    productName: string;
    quantity: number;
}

// Function to compare two arrays of objects
export const compareArrays = (arr1: Product[], arr2: Product[]): boolean => {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Sort arrays based on some unique property for each object, for example, productId
    arr1.sort((a, b) => a.productId.localeCompare(b.productId));
    arr2.sort((a, b) => a.productId.localeCompare(b.productId));

    // Compare each object in the arrays
    for (let i = 0; i < arr1.length; i++) {
        // Compare specific properties of the objects
        if (
            arr1[i].discountedPrice !== arr2[i].discountedPrice ||
            arr1[i].productId !== arr2[i].productId ||
            arr1[i].productName !== arr2[i].productName ||
            arr1[i].quantity !== arr2[i].quantity
        ) {
            return false;
        }
    }

    // If all objects are the same, return true
    return true;
};

export const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    return currentMonth;
};
