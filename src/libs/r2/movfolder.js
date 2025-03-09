import config from '../../../next.config.js';
import fs from 'fs';
import path from 'path';

const r2_folder_name = 'r2folder'
const hashes_filename =  'next-image-export-optimizer-hashes.json'
const sourceFolder = config.env.nextImageExportOptimizer_imageFolderPath;
const targetFolder = path.join(`${r2_folder_name}/`, sourceFolder.replace('public/',''))
if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
}

function moveFoldersByName(folder, folderName, destination, log = false) {
    fs.readdir(folder, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('readdir error:', err);
            return;
        }

        files.forEach((file) => {
            const currentPath = path.join(folder, file.name);
            if (file.isDirectory() && file.name === folderName) {
                const newPath = path.join(file.parentPath.replace('public', r2_folder_name), folderName);
                if (!fs.existsSync(newPath)) {
                    fs.mkdirSync(newPath, { recursive: true });
                }
                fs.readdir(currentPath, { withFileTypes: true }, (err, files)=> {
                    if(err) {
                        console.log('readdir error:', err)
                    }
                    else {
                        files.forEach((file)=>{
                            const oldName = `${currentPath}/${file.name}`
                            const newName = `${newPath}/${file.name}`
                            fs.rename(oldName, newName, (err) => {
                                if (err) {
                                    console.error('rename error:', err);
                                } else {
                                    if(log) console.log(`${oldName} -> ${newName} (success)`);
                                }
                            });
                        })
                    }
                })
            } else if (file.isDirectory()) {
                moveFoldersByName(currentPath, folderName, destination);
            } else { // hash json file
                const newPath = path.join(file.parentPath.replace('public', r2_folder_name), file.name);
                if(file.name == hashes_filename) {
                    fs.rename(currentPath, newPath, (err)=>{
                        if (err) {
                            console.error('rename error:', err);
                        } else {
                            if(log) console.log(`${currentPath} -> ${newPath} (success)`);
                        }
                    })
                }
            }
        });
    });
}

moveFoldersByName(sourceFolder, 'nextImageExportOptimizer', targetFolder);