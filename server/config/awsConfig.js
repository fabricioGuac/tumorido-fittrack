// Import the S3Client and necessary commands from the AWS SDK v3
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } =  require('@aws-sdk/s3-request-presigner');


// Creates an instance of the S3 service with the necessary credentials and region 
const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

module.exports = {s3, PutObjectCommand, getSignedUrl, DeleteObjectCommand };
