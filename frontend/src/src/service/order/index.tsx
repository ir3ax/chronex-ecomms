import { axiosInstance } from "../axios";
import { DeleteOrderRequest, DeleteOrderResponse, GetAllOrderResponse, SaveOrderRequest, SaveOrderRequestPublic, SaveOrderResponse, SaveOrderResponsePublic, UpdateOrderRequest, UpdateOrderResponse } from "./schema";

export const saveOrder = async (data: SaveOrderRequest) => {
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
    };

    const response = await axiosInstance.post(`admin/order`, requestData);
    return response.data as SaveOrderResponse;
};

export const getAllOrder = async (sort: string, search: string = '', orderStatus: string = '') => {
    const response = await axiosInstance.get(`admin/order-sort/${sort}`, {
        params: {
            search,
            orderStatus
        }
    });
    return response.data as GetAllOrderResponse;
};

export const updateOrder = async (data: UpdateOrderRequest) => {

    const requestData = {
        ...data,
    };

    const response = await axiosInstance.put(`admin/order-update`, requestData);
    return response.data as UpdateOrderResponse;
};

export const deleteOrder = async (data: DeleteOrderRequest) => {
 
    const requestData = {
    ...data,
    };

    const response = await axiosInstance.put(`admin/order-update-status`, requestData);
    return response.data as DeleteOrderResponse;
};

export const saveOrderPublic = async (data: SaveOrderRequestPublic) => {
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
    };

    const response = await axiosInstance.post(`admin/order`, requestData);
    return response.data as SaveOrderResponsePublic;
};

export const getAllOrderRevenue = async (orderStatus: string = '') => {
    const response = await axiosInstance.get(`admin/order-revenue`, {
        params: {
            orderStatus
        }
    });
    return response.data;
};

export const getAllTotalOrder = async (orderStatus: string = '') => {
    const response = await axiosInstance.get(`admin/order-total-quantity`, {
        params: {
            orderStatus
        }
    });
    return response.data;
};

export const getBestSellingProducts = async (orderStatus: string = '') => {
    const response = await axiosInstance.get(`admin/best-selling`, {
        params: {
            orderStatus
        }
    });
    return response.data;
};