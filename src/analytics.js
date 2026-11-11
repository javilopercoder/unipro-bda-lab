import {fictionalName} from './demo-data.js';
export const PURCHASES=[
 {cliente:'Ana',region:'Centro',categoria:'Informática',importe:170,mes:1},
 {cliente:'Luis',region:'Sur',categoria:'Lectura',importe:120,mes:1},
 {cliente:'Marta',region:'Centro',categoria:'Informática',importe:200,mes:2},
 {cliente:'Eva',region:'Este',categoria:'Papelería',importe:80,mes:2},
 {cliente:'Pablo',region:'Centro',categoria:'Lectura',importe:240,mes:2},
 {cliente:'Ana',region:'Centro',categoria:'Papelería',importe:40,mes:3},
 {cliente:'Luis',region:'Sur',categoria:'Informática',importe:90,mes:3}
];
// 4.000 operaciones adicionales, generadas siempre con la misma semilla.
export const PURCHASE_COUNT=4007;
const names=Array.from({length:400},(_,i)=>fictionalName(i+100));
const regions=['Centro','Sur','Este'],categories=['Informática','Lectura','Papelería','Hogar'];
for(let i=0;i<4000;i++)PURCHASES.push({
 cliente:names[(i*17)%names.length],region:regions[(i*7)%regions.length],
 categoria:categories[(i*11)%categories.length],importe:Math.round((25+((i*37)%970))*100)/100,
 mes:1+(i%12)
});
export function rollup(key='categoria'){
 if(!['categoria','region','mes','cliente'].includes(key))throw Error('Dimensión inválida');
 const map=new Map;for(const row of PURCHASES){const k=String(row[key]);map.set(k,(map.get(k)||0)+row.importe)}
 return[...map].map(([dimension,total])=>({dimension,total})).sort((a,b)=>b.total-a.total);
}
export function segments(){
 const map=new Map;for(const row of PURCHASES){const a=map.get(row.cliente)||{cliente:row.cliente,compras:0,gasto:0};a.compras++;a.gasto+=row.importe;map.set(row.cliente,a)}
 return[...map.values()].map(x=>({...x,segmento:x.gasto>=250?'Alto':x.gasto>=150?'Medio':'Bajo'})).sort((a,b)=>b.gasto-a.gasto);
}
export function distributed({pushdown=true,region='Centro'}={}){
 if(!['Centro','Sur','Este'].includes(region))throw Error('Región inválida');
 const selected=PURCHASES.filter(x=>x.region===region);
 return{region,rowsTransferred:pushdown?selected.length:PURCHASES.length,rowsMatched:selected.length,total:selected.reduce((a,x)=>a+x.importe,0),type:'simulación educativa; no existe tráfico de red real'};
}
