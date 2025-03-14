import dotenv from 'dotenv';
import fs from 'fs';
import { download_bucket } from './bucket_manager.js'

console.log('R2 file download test')

const r2_folder_name = 'r2folder_test'
async function main(){
    if(fs.existsSync('.env.local')){
        dotenv.config({path:'.env.local'})
    }
    await download_bucket(process.env.BUCKET_NAME, r2_folder_name)
    console.log('download complete!')
}
try {
    main()
}
catch(err) {
    console.error(err)
}