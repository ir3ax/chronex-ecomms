import z from 'zod';

// Define a union type for productFreebies that can accept either string[], Freebie[], or a single string
export const productFreebiesType = z.union([
    z.string(),
    z.array(z.string()),
    z.array(z.object({
        freebiesId: z.string(),
        freebiesName: z.string(),
        freebiesStorePrice: z.number(),
        freebiesOriginalQuantity: z.number(),
        freebiesCurrentQuantity: z.number(),
        freebiesImg: z.string(),
    })),
]);

export const description2Type = z.union([
    z.string(),
    z.array(z.string()),
]);

export const imgType = z.union([
    z.string(),
    z.array(z.string()),
    z.array(z.object({
        imgUrl: z.string(),
    })),
]);

export const saveProductRequest = z.object({
    productName: z.string().nonempty({ message: 'Freebies name is required.'}).max(255, { message: 'Freebies name must be between 1 and 255 characters' }),
    img: imgType.nullable().optional(),
    discount: z.string().transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid store price');
        }
        return parsedValue;
    }).optional(),
    supplierPrice: z.string().nonempty({ message: 'Freebies supplier price is required.'}).transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid original quantity');
        }
        return parsedValue;
    }),
    originalPrice: z.string().nonempty({ message: 'Freebies original price is required.'}).transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid original quantity');
        }
        return parsedValue;
    }),
    discountedPrice: z.number(),
    description1: z.string().optional(),
    description2: description2Type.nullable().optional(),
    originalQuantity: z.string().nonempty({ message: 'Freebies orginal quantity is required.'}).transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid original quantity');
        }
        return parsedValue;
    }),
    currentQuantity: z.number(),
    productSold: z.string().nonempty({ message: 'Freebies orginal quantity is required.'}).transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid original quantity');
        }
        return parsedValue;
    }),
    productFreebies: productFreebiesType.nullable().optional(),
    productStatus: z.string().nullable().optional()
});

export const saveProductResponse = z.object({
    productData: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        img: z.string(),
        discount: z.number(),
        supplierPrice: z.number(),
        originalPrice: z.number(),
        discountedPrice: z.number(),
        description1: z.string(),
        description2: z.string(),
        originalQuantity: z.number(),
        currentQuantity: z.number(),
        productSold: z.number(),
        productFreebies: z.string(),
        productStatus: z.string(),
        createdBy: z.string(),
        createdAt: z.string(),
        updatedBy: z.string(),
        updatedAt: z.string(),
    })),
});

export type SaveProductRequest   = z.infer<typeof saveProductRequest>;
export type SaveProductResponse  = z.infer<typeof saveProductResponse>;

export const getAllProductRequest = z.object({
    search: z.string().optional(),
    sortOptionProduct: z.string().optional(),
});

export type GetAllProductRequest   = z.infer<typeof getAllProductRequest>;
export type GetAllProductResponse  = SaveProductResponse;

export const updateProductRequest = z.object({
    productId: z.string(),
    productName: z.string().optional(),
    img: imgType.nullable().optional(),
    discount: z.any().transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid discount');
        }
        return parsedValue;
    }).optional(),
    supplierPrice: z.any().transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid supplier price');
        }
        return parsedValue;
    }).optional(),
    originalPrice: z.any().transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid original price');
        }
        return parsedValue;
    }).optional(),
    discountedPrice: z.number().optional(),
    description1: z.string().optional(),
    description2: description2Type.nullable().optional(),
    productSold: z.any().transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid product sold');
        }
        return parsedValue;
    }).optional(),
    productFreebies: productFreebiesType.nullable().optional(),
    productStatus: z.string().nullable().optional()
});

export type UpdateProductRequest   = z.infer<typeof updateProductRequest>;
export type UpdateProductResponse  = SaveProductResponse;

export const updateQuantityProductRequest = z.object({
    productId: z.string(),
    productOriginalQuantity: z.number(),
    productCurrentQuantity: z.number(),
});

export type UpdateQuantityProductRequest   = z.infer<typeof updateQuantityProductRequest>;
export type UpdateQuantityProductResponse  = SaveProductResponse;

export const deleteProductRequest = z.object({
    productId: z.string(),
    productStatus: z.string()
});

export type DeleteProductRequest   = z.infer<typeof deleteProductRequest>;
export type DeleteProductResponse  = SaveProductResponse;