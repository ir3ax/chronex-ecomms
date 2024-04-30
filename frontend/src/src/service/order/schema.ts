import { z } from 'zod';

const ProductSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    discountedPrice: z.number(),
    quantity: z.number(),
    freebies: z.string().optional().nullable()
});

const CompleteAddressSchema = z.object({
    address: z.string(),
    barangay: z.string(),
    city: z.string(),
    houseNumber: z.string(),
    landMark: z.string(),
    province: z.string(),
    region: z.string(),
});

const CustomerSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    emailAddress: z.string().email(),
    contactNumber: z.string(),
});

export const saveOrderRequest = z.object({
    customer: CustomerSchema,
    completeAddress: CompleteAddressSchema,
    product: z.array(ProductSchema),
    total: z.number(),
    orderStatus: z.string()
});

export const saveOrderResponse = z.object({
    orderData: z.array(z.object({
        orderId: z.string(),
        customer: CustomerSchema,
        completeAddress: CompleteAddressSchema,
        product: z.array(ProductSchema),
        total: z.number(),
        orderStatus: z.string(),
        trackingId: z.string(),
        stickyNotes: z.string(),
        createdBy: z.string(),
        createdAt: z.string(),
        updatedBy: z.string(),
        updatedAt: z.string(),
    })),
});

export type SaveOrderRequest   = z.infer<typeof saveOrderRequest>;
export type SaveOrderResponse  = z.infer<typeof saveOrderResponse>;

export const getAllOrderRequest = z.object({
    search: z.string().optional(),
    sortOption: z.string().optional(),
    orderStatus: z.string().optional(),
});

export type GetAllOrderRequest   = z.infer<typeof getAllOrderRequest>;
export type GetAllOrderResponse  = SaveOrderResponse;

const ProductSchemaUpdate = z.object({
    productId: z.string().optional(),
    productName: z.string().optional(),
    discountedPrice: z.number().optional(),
    quantity: z.number().optional(),
    freebies: z.string().optional().nullable()
});

const CompleteAddressSchemaUpdate = z.object({
    address: z.string().optional(),
    barangay: z.string().optional(),
    city: z.string().optional(),
    houseNumber: z.string().optional(),
    landMark: z.string().optional(),
    province: z.string().optional(),
    region: z.string().optional(),
});

const CustomerSchemaUpdate = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    emailAddress: z.string().optional(),
    contactNumber: z.string().optional(),
});

export const updateOrderRequest = z.object({
    orderId: z.string(),
    customer: CustomerSchemaUpdate,
    completeAddress: CompleteAddressSchemaUpdate,
    product: z.array(ProductSchemaUpdate),
    total: z.number(),
    orderStatus: z.string(),
    trackingId: z.string().optional(),
    stickyNotes: z.string().nullable().optional()
});

export type UpdateOrderRequest   = z.infer<typeof updateOrderRequest>;
export type UpdateOrderResponse  = SaveOrderResponse;

export const deleteOrderRequest = z.object({
    orderId: z.string(),
    orderStatus: z.string()
});

export type DeleteOrderRequest   = z.infer<typeof deleteOrderRequest>;
export type DeleteOrderResponse  = SaveOrderResponse;

const textFirstNameRegex = z
	.string()
	.regex(/^[a-zA-Z\s]*$/, { message: 'Letters only.' })
	.regex(/^(?!\s*$)(\s*\S+\s*)+$/, { message: 'Required.' })
	.transform((val) => val.trim().replace(/\s+/g, ' '));

const textLastNameRegex = z
	.string()
	.regex(/^[a-zA-Z\s]*$/, { message: 'Letters only.' })
	.regex(/^(?!\s*$)(\s*\S+\s*)+$/, { message: 'Required.' })
	.transform((val) => val.trim().replace(/\s+/g, ' '));

const contactNumberRegex = z
.string()
.regex(/^\+?[0-9]{1,3}-?[0-9]{3,14}$/ , {message: 'Invalid Contact Number'})
.regex(/^(?!\s*$)(\s*\S+\s*)+$/, { message: 'Required.' })


const CompleteAddressSchemaPublic = z.object({
    address: z.string().nonempty({ message: 'Required.'}),
    barangay: z.string(),
    city: z.string(),
    houseNumber: z.string().nonempty({ message: 'Required.'}),
    landMark: z.string().nonempty({ message: 'Required.'}),
    province: z.string(),
    region: z.string(),
});

const CustomerSchemaPublic = z.object({
    firstName: textFirstNameRegex,
    lastName: textLastNameRegex,
    emailAddress: z.string().email().nonempty({ message: 'Email address is required.'}),
    contactNumber: contactNumberRegex,
});

export const saveOrderRequestPublic = z.object({
    customer: CustomerSchemaPublic,
    completeAddress: CompleteAddressSchemaPublic,
    product: z.array(ProductSchema),
    total: z.number(),
    orderStatus: z.string()
});

export type SaveOrderRequestPublic   = z.infer<typeof saveOrderRequestPublic>;
export type SaveOrderResponsePublic  = z.infer<typeof saveOrderResponse>;