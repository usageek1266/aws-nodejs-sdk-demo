const AWS = require('aws-sdk');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: "yly",
    secretAccessKey: "yly",
    endpoint: "127.0.0.1:8000",
    s3ForcePathStyle: true,
    signatureVersion: "v2",
    sslEnabled: false
});

const bucket_name = "test1";
const object_name = "3.txt";


const params = {
    Expires: 3600,
    Bucket: bucket_name,
    Key: object_name,
    Conditions: [["content-length-range", 1, 10000000]], // you can upload file size range from 1Byte to 10MB
    Fields: {
        "key": object_name
    }
};

s3.createPresignedPost(params, (err, data) => {
    if(err) {
        console.log('s3.createPresignedPost err:',err);
    } else {
        const form = new FormData();
        for(const field in data.fields) {
            form.append(field, data.fields[field]);
        }
        form.append('file', fs.createReadStream("/root/1.txt"));
        form.getLength((err, length) => {
            console.log(`Length: ${length}`);
            fetch(data.url, {
                method: 'POST',
                body: form,
                headers: {
                    'Content-Length': length
                }
            }).then((response) => {
                console.log(response.ok);
                console.log(response.status);
                console.log(response.statusText);
                return response.text();
            }).then((payload) => {
                console.log(payload);
                console.log(form.getHeaders());
            }).catch((err) => {
                console.log(`Error: ${err}`)
            });
        });
    }
})
