import config from '../next.config.js';
import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import crypto from 'crypto';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { delete_files, upload_files } from './s3/bucket_manager.js';

const r2_folder_name = '.r2folder'
const img_folder = 'my-opt'
const json_filename = 'uwu.json'

async function main() {
    try {
        if(fs.existsSync('.env.local')){
            dotenv.config({path:'.env.local'})
        }
        const env_public = path.join(config.env.nextImageExportOptimizer_imageFolderPath, '/').replaceAll('\\','/')

        const public_folder = path.join(process.cwd(), env_public)
        const gif_files = {}
        console.log('public gif files analysis...')
        sync(`${public_folder}/**/*.gif`, { posix:true, dotRelative:true, nocase:true }).forEach(path=>{
            let webp = path.split('.')
            webp.pop()
            webp = `${webp.join('.')}.webp`
            const data = fs.readFileSync(path)
            const sha256 = crypto.createHash('sha256')
            sha256.update(data)
            const hash_data = sha256.digest('hex')
            return gif_files[path.replace('./public/', '')] = { hash: hash_data, webp: webp.replace('./public/', ''), cached: false }
        })

        const json_file = `${r2_folder_name}/${img_folder}/${json_filename}`
        let json_data = {}
        if(fs.existsSync(json_file)){
            const buffer = fs.readFileSync(json_file, 'utf-8')
            json_data = JSON.parse(buffer)
        }
        else {
            fs.mkdirSync(`${r2_folder_name}/${img_folder}`, {recursive:true})
        }
        const useless_files = []
        let cached_n = 0
        Object.keys(json_data).map((path)=>{
            if(!gif_files.hasOwnProperty(path)){
                useless_files.push(path)
            }
            else if(gif_files[path].hash === json_data[path]) {
                gif_files[path].cached = true
                cached_n += 1
            }
        })
        if(useless_files.length > 0) {
            await delete_files(process.env.BUCKET_NAME, useless_files)
        }

        const update = []
        const total_n = Object.keys(gif_files).length
        json_data = {}
        console.log(`${total_n} gif -> webp (${cached_n} cached)`)
        Object.keys(gif_files).forEach(async (file, i)=>{
            json_data[file] = gif_files[file].hash
            const source = `./public/${file}`
            const dest = `./public/${gif_files[file].webp}`
            if(!gif_files[file].cached){
                await sharp(source, {animated:true, limitInputPixels:false}).webp({
                    quality:100,
                    nearLossless:true,
                }).toFile(dest)
                console.log(`---- ${i+1}/${total_n}  ${gif_files[file].webp}`)
                update.push({
                    key:`${img_folder}/${gif_files[file].webp}`,
                    source:dest
                })
            }
            else {
                const oldname = `${r2_folder_name}/${img_folder}/${file}`
                fs.renameSync(oldname, dest)
            }
            fs.rmSync(source)
        })
        console.log('gif -> webp done!')
        fs.writeFileSync(json_file, JSON.stringify(json_data, null, 2))
        update.push({
            key:`${img_folder}/${json_filename}`,
            source:json_file
        })
        if(update.length > 0) {
            await upload_files(process.env.BUCKET_NAME, update)
            console.log(`${update.length} files uploaded!`)
        }
        fs.rmSync(`./${r2_folder_name}/${img_folder}/`, { recursive:true, force:true })
    }
    catch(err) {
        console.error(err)
        return true
    }
    return false
}

if(await main()){
    process.stdout.write('=-=-= (。>︿<)。 flush! =-=-=\n', ()=>{
        process.exit(1)
    })
}