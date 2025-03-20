import config from '../next.config.js';
import fs from 'fs';
import path from 'path';
import { sync } from 'glob';

const env_public = path.join(config.env.nextImageExportOptimizer_imageFolderPath, '/').replaceAll('\\','/')
const public_folder = path.join(process.cwd(), env_public)

async function main() {
    try {
        const files = sync(`${public_folder}/**/*.webp`, { posix:true, dotRelative:true, nocase:true })
        files.forEach(file=>{
            fs.rmSync(file)
        })
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