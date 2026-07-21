import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export default cloudinary;
console.log({
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secretLength: process.env.CLOUDINARY_API_SECRET?.length,
});
export async function uploadImage(fileBase64: string, folder = "owa/products") {
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

