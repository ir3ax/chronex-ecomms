import { axiosInstance } from "../axios";
import { DeleteReviewsRequest, DeleteReviewsResponse, GetAllReviewsResponse, SaveReviewsRequest, SaveReviewsResponse, UpdateReviewsRequest, UpdateReviewsResponse } from "./schema";

export const saveReviews = async (data: SaveReviewsRequest) => {
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
    };

    const response = await axiosInstance.post(`admin/reviews`, requestData);
    return response.data as SaveReviewsResponse;
};

export const updateReviews = async (data: UpdateReviewsRequest) => {
    
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
    };

    const response = await axiosInstance.put(`admin/reviews-update`, requestData);
    return response.data as UpdateReviewsResponse;
};


export const getAllReviews = async (sort: string, search: string = '') => {
    const response = await axiosInstance.get(`admin/reviews-sort/${sort}`, {
        params: { search }
    });
    return response.data as GetAllReviewsResponse;
};


export const deleteReviews = async (data: DeleteReviewsRequest) => {
 
    const requestData = {
    ...data,
    };

    const response = await axiosInstance.put(`admin/reviews-update-status`, requestData);
    return response.data as DeleteReviewsResponse;
};

export const getReviewsById = async (reviewsId: string) => {
    const response = await axiosInstance.get(`admin/reviews/${reviewsId}`)
    return response.data as GetAllReviewsResponse;
};