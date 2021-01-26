const AWS = require('aws-sdk');

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: "yly",
    secretAccessKey: "yly",
    endpoint: "127.0.0.1:8000",
    s3ForcePathStyle: true,
    signatureVersion: "v2",
    sslEnabled: false
});

s3.listBuckets((err, data) => {
    if(err) {
        console.log(err);
    } else {
        for (const item in data.Buckets)  {
            console.log(data.Buckets[item]);
        }
    }
})