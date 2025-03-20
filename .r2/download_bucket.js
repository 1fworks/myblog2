import fs from 'fs';
import dotenv from 'dotenv';
import { download_bucket } from './s3/bucket_manager.js'

const r2_folder_name = '.r2folder'

async function main() {
    try {
        if(fs.existsSync('.env.local')){
            dotenv.config({path:'.env.local'})
        }
        await download_bucket(process.env.BUCKET_NAME, r2_folder_name)
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