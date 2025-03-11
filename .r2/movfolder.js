import config from '../next.config.js';
import fs from 'fs';
import path from 'path';

const r2_folder_name = 'r2folder'
const hashes_filename =  'next-image-export-optimizer-hashes.json'
const sourceFolder = config.env.nextImageExportOptimizer_imageFolderPath;
const targetFolder = path.join(`${r2_folder_name}/`, sourceFolder.replace('public/',''))

async function moveFoldersByName(folder, folderName, destination) {
    const files = await fs.promises.readdir(folder, { withFileTypes:true })
    await Promise.all(
        files.map(async(file) => {
            const currentPath = path.join(folder, file.name);
            if (file.isDirectory() && file.name === folderName) {
                const newPath = path.join(file.parentPath.replace('public', r2_folder_name), folderName);
                try {
                    await fs.promises.access(path.join(newPath, '/'))
                }
                catch(err) {
                    await fs.promises.mkdir(newPath, { recursive: true })
                }
                const files = await fs.promises.readdir(currentPath, { withFileTypes:true })
                await Promise.all(
                    files.map(async(file)=>{
                        const oldName = `${currentPath}/${file.name}`
                        const newName = `${newPath}/${file.name}`
                        await fs.promises.rename(oldName, newName)
                    })
                )
            } else if (file.isDirectory()) {
                await moveFoldersByName(currentPath, folderName, destination);
            } else { // hash json file
                const newFolder = path.join(file.parentPath.replace('public', r2_folder_name), '/')
                const newPath = path.join(newFolder, file.name);
                if(file.name == hashes_filename) {
                    try {
                        await fs.promises.access(newFolder)
                    }
                    catch(err) {
                        await fs.promises.mkdir(newFolder, { recursive: true })
                    }
                    await fs.promises.rename(currentPath, newPath)
                }
            }
        })
    )
}

async function main() {
    try {
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }
        console.log('mov nextImageExportOptimizer folders...')
        await moveFoldersByName(sourceFolder, 'nextImageExportOptimizer', targetFolder);
        console.log('mov done!')
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