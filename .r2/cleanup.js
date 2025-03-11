import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import { main as movfolder } from './movfolder';

movfolder()

const list = sync(`${path.join(process.cwd(), '/public')}/**/nextImageExportOptimizer`, { posix:true, dotRelative:true })
list.forEach(path=>{
    fs.rmdirSync(path)
})

