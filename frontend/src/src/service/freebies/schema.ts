import z from 'zod';

export const saveFreebiesRequest = z.object({
    freebiesName: z.string().nonempty({ message: 'Freebies name is required.'}).max(255, { message: 'Freebies name must be between 1 and 255 characters' }),
    freebiesImg: z.union([z.string(), z.instanceof(File)]).nullable(),
    freebiesStorePrice: z.string().nonempty({ message: 'Freebies store price is required.'}).transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid store price');
        }
        return parsedValue;
    }),
    freebiesOriginalQuantity: z.string().nonempty({ message: 'Freebies orginal quantity is required.'}).transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid original quantity');
        }
        return parsedValue;
    }),
    freebiesCurrentQuantity: z.number(),
    freebiesStatus: z.string().nullable().optional()
});

export const saveFreebiesResponse = z.object({
    freebiesData: z.array(z.object({
        freebiesId: z.string(),
        freebiesName: z.string(),
        freebiesImg: z.string(),
        freebiesStorePrice: z.number(),
        freebiesOriginalQuantity: z.number(),
        freebiesCurrentQuantity: z.number(),
        freebiesStatus: z.string(),
        createdBy: z.string(),
        createdAt: z.string(),
        updatedBy: z.string(),
        updatedAt: z.string(),
    })),
});

export type SaveFreebiesRequest   = z.infer<typeof saveFreebiesRequest>;
export type SaveFreebiesResponse  = z.infer<typeof saveFreebiesResponse>;


export const getAllFreebiesRequest = z.object({
    search: z.string().optional(),
    sortOption: z.string().optional(),
});

export type GetAllFreebiesRequest   = z.infer<typeof getAllFreebiesRequest>;
export type GetAllFreebiesResponse  = SaveFreebiesResponse;

export const updateFreebiesRequest = z.object({
    freebiesId: z.string(),
    freebiesName: z.string().optional(),
    freebiesImg: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    freebiesStorePrice: z.any().transform((val) => {
        const parsedValue = parseFloat(val);
        if (isNaN(parsedValue)) {
            throw new Error('Please provide a valid store price');
        }
        return parsedValue;
    }),
    freebiesStatus: z.string().nullable().optional()
});

export type UpdateFreebiesRequest   = z.infer<typeof updateFreebiesRequest>;
export type UpdateFreebiesResponse  = SaveFreebiesResponse;

export const updateQuantityFreebiesRequest = z.object({
    freebiesId: z.string(),
    freebiesOriginalQuantity: z.number(),
    freebiesCurrentQuantity: z.number(),
});

export type UpdateQuantityFreebiesRequest   = z.infer<typeof updateQuantityFreebiesRequest>;
export type UpdateQuantityFreebiesResponse  = SaveFreebiesResponse;

export const deleteFreebiesRequest = z.object({
    freebiesId: z.string(),
    freebiesStatus: z.string()
});

export type DeleteFreebiesRequest   = z.infer<typeof deleteFreebiesRequest>;
export type DeleteFreebiesResponse  = SaveFreebiesResponse;