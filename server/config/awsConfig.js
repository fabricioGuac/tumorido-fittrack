const AWS = require('aws-sdk');

// Configures the AWS SDK with the necessary credentials and region to interact with the S3 bucket
AWS.config.update({
    accessKey:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:'us-east-1'
})

// Creates an instance of the S3 service to interact with the S3 bucket
const s3 = new AWS.S3(); 

module.exports = s3;

