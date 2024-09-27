import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

async function deleteFileFromS3(bucketName, key) {
    const s3Client = new S3Client({});
    try {
        const deleteParams = {
            Bucket: bucketName,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);

        console.log(`Archivo eliminado de S3 con clave: ${key}`);
    } catch (error) {
        console.error("Error al eliminar el archivo de S3:", error);
        throw error;
    }
}

export default deleteFileFromS3;