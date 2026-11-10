import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
 base:'./',
 optimizeDeps:{exclude:['@electric-sql/pglite']},
 build:{
  target:'es2022',
  outDir:'dist',
  rollupOptions:{input:{campus:resolve(process.cwd(),'index.html'),bda:resolve(process.cwd(),'bda.html')}}
 },
 server:{host:'127.0.0.1'}
});
