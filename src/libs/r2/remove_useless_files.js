import config from '../../../next.config.js';
import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import crypto from 'crypto';

const r2_folder_name = 'r2folder'
const sourceFolder = config.env.nextImageExportOptimizer_imageFolderPath;
const target_folder = path.join(process.cwd(), `/${r2_folder_name}/`, sourceFolder.replace('public/',''))

const buffer = fs.readFileSync(`${r2_folder_name}/my-uwu-img-data.json`, 'utf-8')
const json_data = JSON.parse(buffer)

const file_types = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'json']
const new_images = sync(`${target_folder}/**/{${file_types.map(filetype=>`*.${filetype}`).join(',')}}`, { posix: true, dotRelative: true })
const update = []
const remove = []
const maintain = []
const prev_files = Object.keys(json_data)
prev_files.forEach((prev_file)=>{
    if(!new_images.includes(prev_file)){
        remove.push(prev_file)
    }
    else {
        const hash = json_data[prev_file]
        const data = fs.readFileSync(prev_file)
        const sha256 = crypto.createHash('sha256')
        sha256.update(data)
        const hash_data = sha256.digest('hex')
        if(hash_data !== hash) {
            update.push(prev_file)
        }
        else maintain.push(prev_file)
    }
    const index = new_images.indexOf(prev_file)
    if(index > -1) new_images.splice(index, 1)
})
update.push(...new_images)

console.log(update, remove)