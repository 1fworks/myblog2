import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

import path from 'path';
import fs from 'fs';
import { finished } from 'stream/promises';

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

export async function get_bucket_list(bucket_name){
    const s3 = getS3()
    const list = []
    let isTruncated = true
    let marker = undefined
    try {
        while(isTruncated) {
            const list_obj = await s3.send(new ListObjectsCommand({
                Bucket: bucket_name,
                Marker: marker,
                MaxKeys: 500,
            }))
            isTruncated = list_obj.IsTruncated
            marker = list_obj.Contents.slice(-1)[0].Key
            list.push(...list_obj.Contents)
        }
        return list
    }
    catch(err) {
        console.log(err)
        return []
    }
}

export async function download_files_from_list(bucket_name, list, localdir=""){
    const s3 = getS3()
    try {
        if(localdir.length > 0 && !fs.existsSync(path.join(localdir, '/'))){
            fs.mkdirSync(path.join(localdir, '/'), {recursive:true});
        }
        const chunk_size = 30
        for(let i=0;i<list.length;i+=chunk_size){
            const chunk = list.slice(i, i+chunk_size)
            await Promise.all(
                chunk.map(async(data)=>{
                    const filename = data.Key
                    const temp = filename.split('/')
                    temp.pop()
                    const parentPath = path.join(`${localdir}/`, temp.join('/'), '/')
                    if(!fs.existsSync(parentPath)){
                        fs.mkdirSync(parentPath, {recursive: true})
                    }
                    const download_file = await s3.send(new GetObjectCommand({
                        Bucket:bucket_name,
                        Key: filename
                    }))
                    const writeStream = fs.createWriteStream(path.join(localdir, filename))
                    download_file.Body.pipe(writeStream)
                    await finished(writeStream)
                    // fs.writeFileSync(path.join(localdir, filename), download_file.Body);
                })
            )
            console.log(`download - ${i+chunk.length}/${list.length}`)
        }
    }
    catch(err){
        console.log(err)
    }
}

export async function download_bucket(bucket_name, localdir=""){
    console.log('download images from bucket...')
    try {
        const list = await get_bucket_list(bucket_name)
        await download_files_from_list(bucket_name, list, localdir)
        console.log('download complete!')
    }
    catch(err) {
        console.error(err)
        throw new Error('download bucket error')
    }
}

export async function delete_files(bucket_name, files) {
    const s3 = getS3()
    try {
        if(files.length > 0) {
            const chunk_size = 500
            for(let i=0;i<files.length;i+=chunk_size){
                const res = await s3.send(new DeleteObjectsCommand({
                    Bucket: bucket_name,
                    Delete: {
                        Objects: files.slice(i, i+chunk_size).map((file)=>{
                            return { Key: file }
                        })
                    }
                }))
                // console.log(res)
            }
        }
    }
    catch(err) {
        console.error(err)
        throw new Error('delete files error')
    }
}

export async function upload_files(bucket_name, files) {
    const s3 = getS3()
    try {
        if(files.length > 0) {
            files.forEach(async(file)=>{
                const res = await s3.send(new PutObjectCommand({
                    Bucket: bucket_name,
                    Key: file.key,
                    Body: fs.createReadStream(file.source)
                }))
                // console.log(res)
            })
        }
    }
    catch(err) {
        console.error(err)
        throw new Error('upload files error')
    }
}