import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import './movfolder.js';

const list = sync(`${path.join(process.cwd(), '/public')}/**/nextImageExportOptimizer`, { posix:true, dotRelative:true })
list.forEach(path=>{
    fs.rmdirSync(path)
})

