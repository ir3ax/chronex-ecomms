import { axiosInstance } from "../axios";
import { DeleteProductRequest, DeleteProductResponse, GetAllProductResponse, SaveProductRequest, SaveProductResponse, UpdateProductRequest, UpdateProductResponse, UpdateQuantityProductRequest, UpdateQuantityProductResponse } from "./schema";

export const saveProduct = async (data: SaveProductRequest) => {
    // Create a new object with base64Img instead of File object
    const requestData = {
        ...data,
    };

    const response = await axiosInstance.post(`admin/product`, requestData);
    return response.data as SaveProductResponse;
};

export const getAllProduct = async (sort: string, search: string = '') => {
    const response = await axiosInstance.get(`admin/product-sort/${sort}`, {
        params: { search }
    });
    return response.data as GetAllProductResponse;
};

export const getProductById = async (productId: string) => {
    const response = await axiosInstance.get(`admin/product/${productId}`)
    return response.data as GetAllProductResponse;
};

export const updateProduct = async (data: UpdateProductRequest) => {

    const requestData = {
        ...data,
    };

    const response = await axiosInstance.put(`admin/product-update`, requestData);
    return response.data as UpdateProductResponse;
};

export const updateProductQuantity = async (data: UpdateQuantityProductRequest) => {
 
    const requestData = {
    ...data,
    };

    const response = await axiosInstance.put(`admin/product-update-quantity`, requestData);
    return response.data as UpdateQuantityProductResponse;
};

export const deleteProduct = async (data: DeleteProductRequest) => {
 
    const requestData = {
    ...data,
    };

    const response = await axiosInstance.put(`admin/product-update-status`, requestData);
    return response.data as DeleteProductResponse;
};