import { axiosInstance } from "../axios";
import { DeleteHomeImagesResponse, SaveHomeImagesRequest, SaveHomeImagesResponse, UpdateHomeImagesRequest, UpdateHomeImagesResponse } from "./schema";


export const saveHomeImages = async (data: SaveHomeImagesRequest) => {
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
    };

    const response = await axiosInstance.post(`admin/home-images`, requestData);
    return response.data as SaveHomeImagesResponse;
};

export const getAllHomeImages = async () => {
    const response = await axiosInstance.get(`admin/home-images-get`, {
    });
    return response.data as SaveHomeImagesResponse;
};

export const updateHomeImages = async (data: UpdateHomeImagesRequest) => {

    const requestData = {
        ...data,
    };

    const response = await axiosInstance.put(`admin/home-images-update`, requestData);
    return response.data as UpdateHomeImagesResponse;
};

export const deleteHomeImages = async (homeImagesId: string) => {
    // Send the DELETE request
    const response = await axiosInstance.delete(`admin/home-images-delete/${homeImagesId}`);
    return response.data as DeleteHomeImagesResponse;
};