import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
  region: import.meta.env.VITE_S3_REGION,
});

export const uploadToS3Dashboard = async (images: File[]) => {
  const promises = images.map(async (image: File, index: number) => {
    const params = {
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME_DASHBOARD,
      Key: `image_${index}_${Date.now()}_${image.name}`,
      Body: image,
      ContentType: image.type,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const location = `https://${import.meta.env.VITE_S3_BUCKET_NAME_DASHBOARD}.s3.${import.meta.env.VITE_S3_REGION}.amazonaws.com/${params.Key}`;
      console.log(`Image ${index + 1} uploaded successfully. Location: ${location}`);
      return location;
    } catch (error) {
      console.error(`Error uploading image ${index + 1}:`, error);
      throw error;
    }
  });

  try {
    const uploadedImageUrls = await Promise.all(promises);
    return uploadedImageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
