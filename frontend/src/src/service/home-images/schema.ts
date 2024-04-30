import z from 'zod';

export const imgType = z.union([
    z.string(),
    z.array(z.string()),
    z.array(z.object({
        imgUrl: z.string(),
    })),
]);

export const homeImagesRequest = z.object({
    homeImg: imgType.nullable().optional(),
});

export const homeImagesResponse = z.object({
    homeImagesData: z.array(z.object({
        homeImagesId: z.string(),
        homeImg: z.string(),
        createdBy: z.string(),
        createdAt: z.string(),
        updatedBy: z.string(),
        updatedAt: z.string(),
    })),
});

export type SaveHomeImagesRequest   = z.infer<typeof homeImagesRequest>;
export type SaveHomeImagesResponse  = z.infer<typeof homeImagesResponse>;

export const updateHomeImagesRequest = z.object({
    homeImagesId: z.string(),
    homeImg: imgType.nullable().optional(),
});

export type UpdateHomeImagesRequest   = z.infer<typeof updateHomeImagesRequest>;
export type UpdateHomeImagesResponse = SaveHomeImagesResponse;

export const deleteHomeImagesRequest = z.object({
    homeImagesId: z.string(),
});

export type DeleteHomeImagesRequest   = z.infer<typeof deleteHomeImagesRequest>;
export type DeleteHomeImagesResponse = SaveHomeImagesResponse;