import config from '../next.config.js';
import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { upload_files, delete_files } from './s3/bucket_manager.js'

const r2_folder_name = 'r2folder'
const sourceFolder = config.env.nextImageExportOptimizer_imageFolderPath;
const target_folder = path.join(process.cwd(), `/${r2_folder_name}/`, sourceFolder.replace('public/',''))

const buffer = fs.readFileSync(`${r2_folder_name}/my-uwu-img-data.json`, 'utf-8')
const json_data = JSON.parse(buffer)

const file_types = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'json']
const new_images = sync(`${target_folder}/**/{${file_types.map(filetype=>`*.${filetype}`).join(',')}}`, { posix: true, dotRelative: true, nocase: true, absolute: false })
const update = []
const remove = []
const maintain = []
const prev_files = Object.keys(json_data)
prev_files.forEach((prev_file)=>{
    const key = prev_file.slice(prev_file.indexOf(r2_folder_name)+r2_folder_name.length+1)
    const index = new_images.indexOf(prev_file)
    if(index < 0){
        remove.push(key)
    }
    else {
        const hash = json_data[prev_file]
        if(hash === "remove") {
            remove.push(key)
        }
        else {
            const data = fs.readFileSync(prev_file)
            const sha256 = crypto.createHash('sha256')
            sha256.update(data)
            const hash_data = sha256.digest('hex')
            if(hash_data !== hash) {
                update.push(key)
            }
            else maintain.push(key)
        }
    }
    if(index > -1) new_images.splice(index, 1)
})
new_images.forEach(img=>{
    const key = img.slice(img.indexOf(r2_folder_name)+r2_folder_name.length+1)
    update.push(key)
})

async function upload_delete_files() {
    try {
        if(fs.existsSync('.env.local')){
            dotenv.config({path:'.env.local'})
        }
        console.log(`remove ${remove.length} file(s)...`)
        await delete_files(process.env.BUCKET_NAME, remove)
        console.log(`upload ${update.length} file(s)...`)
        await upload_files(process.env.BUCKET_NAME, update, r2_folder_name)
        console.log('----- ready to deploy my blog!')
    }
    catch(err) {
        return true
    }
    return false
}

if(await upload_delete_files()){
    process.stdout.write('=-=-= (。>︿<)。 flush! =-=-=\n', ()=>{
        process.exit(1)
    })
}