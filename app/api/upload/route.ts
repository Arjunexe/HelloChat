import { NextRequest, NextResponse } from "next/server";
import cloudinaryConfig from "@/lib/cloudinary/cloudinary";

// Max file size: 4.5MB (Vercel serverless function limit)
const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No image selected" },
                { status: 400 }
            );
        }

        // File size validation
        if (file.size > MAX_FILE_SIZE) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            return NextResponse.json(
                { success: false, error: `Image too large (${sizeMB}MB). Maximum size is 4.5MB.` },
                { status: 400 }
            );
        }

        // File type validation
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { success: false, error: "Please select an image file" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinaryConfig.uploader
                .upload_stream(
                    {
                        folder: "chatroom",
                        resource_type: "image",
                    },
                    (error, uploadResult) => {
                        if (error) reject(error);
                        else resolve(uploadResult);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error: any) {
        console.error("Upload error:", error);

        if (error?.http_code === 400) {
            return NextResponse.json(
                { success: false, error: "Invalid image format" },
                { status: 400 }
            );
        }
        if (error?.http_code === 413) {
            return NextResponse.json(
                { success: false, error: "Image too large for Cloudinary" },
                { status: 413 }
            );
        }

        return NextResponse.json(
            { success: false, error: error?.message || "Upload failed. Please try a smaller image." },
            { status: 500 }
        );
    }
}
