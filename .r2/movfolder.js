import config from '../next.config.js';
import fs from 'fs';
import path from 'path';

const r2_folder_name = 'r2folder'
const hashes_filename =  'next-image-export-optimizer-hashes.json'
const sourceFolder = config.env.nextImageExportOptimizer_imageFolderPath;
const targetFolder = path.join(`${r2_folder_name}/`, sourceFolder.replace('public/',''))
if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
}

function moveFoldersByName(folder, folderName, destination) {
    fs.readdirSync(folder, { withFileTypes:true }).forEach(files => {
        files.forEach((file) => {
            const currentPath = path.join(folder, file.name);
            if (file.isDirectory() && file.name === folderName) {
                const newPath = path.join(file.parentPath.replace('public', r2_folder_name), folderName);
                if (!fs.existsSync(path.join(newPath, '/'))) {
                    fs.mkdirSync(newPath, { recursive: true });
                }
                fs.readdirSync(currentPath, { withFileTypes:true }).forEach((files)=>{
                    files.forEach((file)=>{
                        const oldName = `${currentPath}/${file.name}`
                        const newName = `${newPath}/${file.name}`
                        fs.renameSync(oldName, newName)
                    })
                })
            } else if (file.isDirectory()) {
                moveFoldersByName(currentPath, folderName, destination);
            } else { // hash json file
                const newFolder = path.join(file.parentPath.replace('public', r2_folder_name), '/')
                const newPath = path.join(newFolder, file.name);
                if(file.name == hashes_filename) {
                    if (!fs.existsSync(newFolder)) {
                        fs.mkdirSync(newFolder, { recursive: true });
                    }
                    fs.renameSync(currentPath, newPath)
                }
            }
        });
    });
}

console.log('mov nextImageExportOptimizer folders...')
moveFoldersByName(sourceFolder, 'nextImageExportOptimizer', targetFolder);
console.log('mov done!')