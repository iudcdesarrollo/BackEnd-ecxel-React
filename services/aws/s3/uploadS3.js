require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { readFile } = require('fs/promises');
const path = require('path');

async function uploadFileToS3(filePath) {
    const bucketRegion = process.env.AWS_REGION;
    const bucketName = process.env.BUCKED_NAME;
    const s3Client = new S3Client({});
    try {
        const fileContent = await readFile(filePath);
        const fileName = path.basename(filePath);
        const key = `backups/${fileName}`;

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const fileUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${key}`;

        return fileUrl;
    } catch (error) {
        console.error("Error al subir el archivo a S3:", error);
        throw error;
    }
}

module.exports = uploadFileToS3;