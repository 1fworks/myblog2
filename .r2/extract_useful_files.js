import config from '../next.config.js';
import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { download_bucket } from './s3/bucket_manager.js'

const image_types = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']
const file_types = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'json']
const cache_filename = 'next-image-export-optimizer-hashes.json'

const r2_folder_name = 'r2folder'

const env_public = path.join(config.env.nextImageExportOptimizer_imageFolderPath, '/').replaceAll('\\','/')
const public_folder = path.join(process.cwd(), env_public)
const r2_folder = path.join(process.cwd(), `${r2_folder_name}/`)

async function main() {
    try {
        if(fs.existsSync('.env.local')){
            dotenv.config({path:'.env.local'})
        }
        console.log('download images from bucket...')
        await download_bucket(process.env.BUCKET_NAME, r2_folder_name)
        console.log('download complete!')

        const public_images = sync(`${public_folder}/**/{${image_types.map(filetype=>`*.${filetype}`).join(',')}}`, { posix: true, dotRelative: true, nocase: true })
        .filter(file=>file.split('/').slice(-2)[0] !== 'nextImageExportOptimizer');
        
        const temp = public_images.map(img=>{
            let filename = img.split('/')
            let tmp = filename[filename.length-1].split('.')
            tmp.pop()
            filename = [...(filename.slice(0, filename.length-1)),'nextImageExportOptimizer',tmp.join('.')].join('/')
            filename = filename.slice(filename.indexOf('public')).slice('public'.length+1)
            return sync(`${r2_folder}${filename}*`, { posix: true, dotRelative: true })
        })
        const useful_files = []
        temp.forEach((file_ary)=>{
            useful_files.push(...file_ary)
        })

        const cache_files = sync(`${r2_folder}${env_public.slice(env_public.indexOf('public')+'public'.length+1)}**/${cache_filename}`, { posix: true, dotRelative: true, nocase: true } );
        useful_files.push(...cache_files)
        
        // useful_files
        // [ ...
        // './r2folder/test/nextImageExportOptimizer/imgfile-opt-256.WEBP',
        // './r2folder/test/nextImageExportOptimizer/imgfile-opt-1920.WEBP',
        // './r2folder/test/nextImageExportOptimizer/imgfile-opt-128.WEBP',
        // './r2folder/test/nextImageExportOptimizer/imgfile-opt-1080.WEBP',
        // './r2folder/test/next-image-export-optimizer-hashes.json' ... ]
        
        const hash_obj = await Promise.all(
            useful_files.map(async(file)=>{
                const data = await fs.promises.readFile(file)
                const sha256 = crypto.createHash('sha256')
                sha256.update(data)
                return {[file]: sha256.digest('hex')}
            })
        )
        const json_data = Object.assign({}, ...hash_obj)
        
        console.log(`mov useful_files to '${env_public}'...`)
        await Promise.all(
            useful_files.map(async(file)=>{
                const dest = file.replace(r2_folder_name, 'public')
                let dest_folder = dest.split('/')
                dest_folder.pop()
                dest_folder = path.join(dest_folder.join('/'), '/')
                try {
                    await fs.promises.access(dest_folder)
                }
                catch(err) {
                    await fs.promises.mkdir(dest_folder, { recursive: true })
                }
                try {
                    await fs.promises.rename(file, dest)
                }
                catch(err) {
                    console.log(dest_folder, file, dest)
                    console.log(err)
                    throw new Error("rename error");
                }
            })
        )

        console.log(`delete useless_files in '${r2_folder_name}'...`)
        const removal_folder_name = `./${r2_folder_name}/`
        const remove_list = sync(`${r2_folder}/**/{${file_types.map(filetype=>`*.${filetype}`).join(',')}}`, { posix: true, dotRelative: true, nocase: true })
        remove_list.forEach((file)=>{
            json_data[file] = "remove"
        })
        fs.rmSync(removal_folder_name, { recursive:true, force:true })
        fs.mkdirSync(r2_folder_name, { recursive:true })
        
        console.log('create my-uwu-img-data.json...')
        fs.writeFileSync(`${r2_folder_name}/my-uwu-img-data.json`, JSON.stringify(json_data, null, 2))

        console.log('----- ready to optimize images!')
    }
    catch(err) {
        console.log(err)
        return true
    }
    return false
}
if(main()){
    process.stdout.write('=-=-= (。>︿<)。 flush! =-=-=\n')
    process.exit(1)
}