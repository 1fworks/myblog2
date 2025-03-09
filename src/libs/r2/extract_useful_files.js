import config from '../../../next.config.js';
import fs from 'fs';
import path from 'path';
import { sync } from 'glob';

const image_types = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']
const cache_filename = 'next-image-export-optimizer-hashes.json'

const r2_folder_name = 'r2folder'

const env_public = path.join(config.env.nextImageExportOptimizer_imageFolderPath, '/').replaceAll('\\','/')
const public_folder = path.join(process.cwd(), env_public)
const r2_folder = path.join(process.cwd(), `${r2_folder_name}/`)

try {
    const public_images = sync(`${public_folder}/**/{${image_types.map(filetype=>`*.${filetype}`).join(',')}}`, { posix: true, dotRelative: true })
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

    const cache_files = sync(`${r2_folder}/**/${cache_filename}`, { posix: true, dotRelative: true } );
    useful_files.push(...cache_files)

    // useful_files
    // [ ...
    // './r2folder/test/nextImageExportOptimizer/imgfile-opt-256.WEBP',
    // './r2folder/test/nextImageExportOptimizer/imgfile-opt-1920.WEBP',
    // './r2folder/test/nextImageExportOptimizer/imgfile-opt-128.WEBP',
    // './r2folder/test/nextImageExportOptimizer/imgfile-opt-1080.WEBP',
    // './r2folder/test/next-image-export-optimizer-hashes.json' ... ]

    console.log(`copy useful_files to '${env_public}'...`)
    useful_files.forEach(file=>{
        const dest = file.replace(r2_folder_name, 'public')
        let dest_folder = dest.split('/')
        dest_folder.pop()
        dest_folder = dest_folder.join('/')
        if (!fs.existsSync(dest_folder)) {
            fs.mkdirSync(dest_folder, { recursive: true });
        }
        fs.rename(file, dest, (err) => {
            if (err) throw err;
        });
    })

    console.log(`delete useless_files in '${r2_folder_name}'...`)
    const removal_folder_name = `./${r2_folder_name}/${env_public.replace('public/', '')}`
    try {
        fs.rmSync(removal_folder_name, { recursive:true, force:true })
    }
    catch(err) {
        throw err;
    }

    console.log('----- ready to optimize images!')
}
catch(err) {
    console.log(err)
}