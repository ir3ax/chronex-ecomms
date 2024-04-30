import { axiosInstance } from "../axios";
import { DeleteFreebiesRequest, DeleteFreebiesResponse, GetAllFreebiesResponse, SaveFreebiesRequest, SaveFreebiesResponse, UpdateFreebiesRequest, UpdateFreebiesResponse, UpdateQuantityFreebiesRequest, UpdateQuantityFreebiesResponse } from "./schema";

export const saveFreebies = async (data: SaveFreebiesRequest) => {
    // Convert freebiesImg to base64 string
    const base64Img = data.freebiesImg instanceof File ? await fileToBase64(data.freebiesImg) : undefined;
    
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
        freebiesImg: base64Img,
    };

    const response = await axiosInstance.post(`admin/freebies`, requestData);
    return response.data as SaveFreebiesResponse;
};

// Function to convert File object to base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result?.toString().split(',')[1];
            if (base64String) {
                resolve(base64String);
            } else {
                reject(new Error('Failed to convert file to base64 string.'));
            }
        };
        reader.onerror = error => reject(error);
    });
};

export const getAllFreebies = async (sort: string, search: string = '') => {
    const response = await axiosInstance.get(`admin/freebies-sort/${sort}`, {
        params: { search }
    });
    return response.data as GetAllFreebiesResponse;
};

export const getAllFreebiesDropdown = async () => {
    const response = await axiosInstance.get(`admin/freebies-dropdown`, {
    });
    return response.data as GetAllFreebiesResponse;
};


export const getFreebiesById = async (freebiesId: string) => {
    const response = await axiosInstance.get(`admin/freebies/${freebiesId}`)
    return response.data as GetAllFreebiesResponse;
};


export const updateFreebies = async (data: UpdateFreebiesRequest) => {
    // Convert freebiesImg to base64 string
    const base64Img = data.freebiesImg instanceof File ? await fileToBase64(data.freebiesImg) : undefined;
    
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
        freebiesImg: base64Img,
    };

    const response = await axiosInstance.put(`admin/freebies-update`, requestData);
    return response.data as UpdateFreebiesResponse;
};

export const updateFreebiesQuantity = async (data: UpdateQuantityFreebiesRequest) => {
 
    const requestData = {
    ...data,
    };

    const response = await axiosInstance.put(`admin/freebies-update-quantity`, requestData);
    return response.data as UpdateQuantityFreebiesResponse;
};

export const deleteFreebies = async (data: DeleteFreebiesRequest) => {
 
    const requestData = {
    ...data,
    };

    const response = await axiosInstance.put(`admin/freebies-update-status`, requestData);
    return response.data as DeleteFreebiesResponse;
};


// export const saveFreebies = async (data: SaveFreebiesRequest) => {
//     const formData = new FormData();
//     formData.append('freebiesName', data.freebiesName);
//     formData.append('freebiesOriginalQuantity', String(data.freebiesOriginalQuantity));
//     formData.append('freebiesCurrentQuantity', String(data.freebiesCurrentQuantity));
//     if (data.freebiesImg instanceof File) {
//         formData.append('freebiesImg', data.freebiesImg);
//     }
	
// 	// eslint-disable-next-line no-useless-catch
// 	try {
// 		const response = await axiosInstance.post<SaveFreebiesResponse>(`admin/freebies`, formData, {
// 			headers: {
// 				'Content-Type': 'multipart/form-data'
// 			}
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };