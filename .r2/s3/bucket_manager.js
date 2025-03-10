import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

import path from 'path';
import fs from 'fs';

const getS3 = () => {
    const s3 = new S3Client({
        region: 'auto',
        endpoint:process.env.BUCKET_ENDPOINT,
        credentials: {
            accessKeyId:process.env.BUCKET_ACCESS_KEY,
            secretAccessKey:process.env.BUCKET_SECRET_KEY,
        },
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
    })
    return s3
}

export async function download_bucket(bucket_name, localdir=""){
    const s3 = getS3()
    if(localdir.length > 0 && !fs.existsSync(path.join(localdir, '/'))){
        fs.mkdirSync(path.join(localdir, '/'), {recursive:true});
    }
    try {
        const list = await s3.send(new ListObjectsCommand({Bucket: bucket_name}))
        
        list.Contents.forEach(async(data)=>{
            const filename = data.Key
            const temp = filename.split('/')
            temp.pop()
            const parentPath = path.join(`${localdir}/`, temp.join('/'), '/')
            if(!fs.existsSync(parentPath)){
                fs.mkdirSync(parentPath, {recursive: true})
            }
            const download_file = await s3.send(new GetObjectCommand({
                Bucket:process.env.BUCKET_NAME,
                Key: filename
            }))
            const writeStream = fs.createWriteStream(path.join(localdir, filename))
            download_file.Body.pipe(writeStream)
        })
    }
    catch(err) {
        console.log(err)
    }
}

export async function delete_files(bucket_name, files) {
    if(files.length > 0) {
        const s3 = getS3()
        const res = await s3.send(new DeleteObjectsCommand({
            Bucket: bucket_name,
            Delete: {
                Objects: files.map((file)=>{
                    return { Key: file }
                })
            }
        }))
    }
    // console.log(res)
}

export async function upload_files(bucket_name, files, localdir="") {
    if(files.length > 0) {
        const s3 = getS3()
        files.forEach(async(file)=>{
            const local_file = path.join(localdir, file)
            const res = await s3.send(new PutObjectCommand({
                Bucket: bucket_name,
                Key: file,
                Body: fs.createReadStream(local_file)
            }))
            // console.log(res)
        })
    }
}