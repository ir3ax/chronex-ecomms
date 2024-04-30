import { z } from "zod";


export const saveReviewsRequest = z.object({
    productId: z.string(),
    reviewsName: z.string().nonempty({ message: 'Reviews display name is required.'}).max(255, { message: 'Reviews display name must be between 1 and 255 characters' }),
    reviewsSubject: z.string().optional(),
    reviewsMessage: z.string().optional(),
    reviewsStarRating: z.number(),
});

export const saveReviewsResponse = z.object({
    reviewsData: z.array(z.object({
        reviewsId: z.string(),
        productId: z.string(),
        reviewsName: z.string(),
        reviewsSubject: z.string(),
        reviewsMessage: z.string(),
        reviewsStarRating: z.number(),
        reviewsStatus: z.string(),
        createdBy: z.string(),
        createdAt: z.string(),
        updatedBy: z.string(),
        updatedAt: z.string(),
    })),
});

export type SaveReviewsRequest   = z.infer<typeof saveReviewsRequest>;
export type SaveReviewsResponse  = z.infer<typeof saveReviewsResponse>;

export const updateReviewsRequest = z.object({
    reviewsId: z.string(),
    productId: z.string(),
    reviewsName: z.string().optional(),
    reviewsSubject: z.string().optional(),
    reviewsMessage: z.string().optional(),
    reviewsStarRating: z.number().optional(),
});

export type UpdateReviewsRequest   = z.infer<typeof updateReviewsRequest>;
export type UpdateReviewsResponse  = SaveReviewsResponse;

export const getAllReviewsRequest = z.object({
    search: z.string().optional(),
    sortOptionReviews: z.string().optional(),
});

export type GetAllReviewsRequest   = z.infer<typeof getAllReviewsRequest>;
export type GetAllReviewsResponse  = SaveReviewsResponse;

export const deleteReviewsRequest = z.object({
    reviewsId: z.string(),
    reviewsStatus: z.string()
});

export type DeleteReviewsRequest   = z.infer<typeof deleteReviewsRequest>;
export type DeleteReviewsResponse  = SaveReviewsResponse;