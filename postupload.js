const AWS = require('aws-sdk');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const mime = require('mime');
const path = require("path");

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
const file_path = '/root/1.jpg';

const object_name = path.basename(file_path);

const params = {
    Expires: 30,
    Bucket: bucket_name,
    Key: object_name,
    Conditions: [
        ["content-length-range", 0, 10000000],  // you can upload file size range from 1Byte to 10MB
        // ["eq", "$Content-Type", "image/jpeg"],
        ["starts-with", "$Content-Type", ""],
        ["starts-with", "$key", ""],
    ],
};

s3.createPresignedPost(params, (err, data) => {
    if(err) {
        console.log('s3.createPresignedPost err:',err);
    } else {
        // let shelljs = require('shelljs');
        // shelljs.exec( "sleep" + " " + 31 , { async : false } ) ;
        const form = new FormData();
        for(const field in data.fields) {
            form.append(field, data.fields[field]);
        }

        form.append('key', object_name);
        form.append('Content-Type', mime.getType(file_path));
        form.append('file', fs.createReadStream(file_path));

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
            }).catch((err) => {
                console.log(`Error: ${err}`)
            });
        });
    }
})
