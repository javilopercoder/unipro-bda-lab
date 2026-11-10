export class RedisSim{
 constructor(){this.data=new Map}
 execute(input){
  const args=String(input||'').trim().match(/"[^"]*"|'[^']*'|\S+/g)?.map(x=>/^["']/.test(x)?x.slice(1,-1):x)||[];
  if(!args.length)throw Error('Escribe un comando.');if(args.length>5||args.some(x=>x.length>300))throw Error('Comando demasiado largo.');
  const [raw,key,value]=args,op=raw.toUpperCase();
  const entry=()=>{const e=this.data.get(key);if(e?.expires&&e.expires<=Date.now()){this.data.delete(key);return null}return e||null};
  if(op==='SET'){if(args.length!==3)throw Error('Uso: SET clave valor');this.data.set(key,{value,expires:null});return'OK'}
  if(op==='GET'){if(args.length!==2)throw Error('Uso: GET clave');return entry()?.value??'(nil)'}
  if(op==='DEL'){if(args.length!==2)throw Error('Uso: DEL clave');const was=!!entry();this.data.delete(key);return was?'(integer) 1':'(integer) 0'}
  if(op==='EXISTS'){if(args.length!==2)throw Error('Uso: EXISTS clave');return entry()?'(integer) 1':'(integer) 0'}
  if(op==='INCR'){if(args.length!==2)throw Error('Uso: INCR clave');const current=entry()?.value??'0';if(!/^-?\d+$/.test(current))throw Error('El valor no es entero');const v=String(Number(current)+1);this.data.set(key,{value:v,expires:null});return'(integer) '+v}
  if(op==='EXPIRE'){if(args.length!==3||!/^\d+$/.test(value))throw Error('Uso: EXPIRE clave segundos');const e=entry();if(!e)return'(integer) 0';e.expires=Date.now()+Number(value)*1000;return'(integer) 1'}
  if(op==='TTL'){if(args.length!==2)throw Error('Uso: TTL clave');const e=entry();return e?(e.expires?'(integer) '+Math.max(0,Math.ceil((e.expires-Date.now())/1000)):'(integer) -1'):'(integer) -2'}
  if(op==='KEYS'){if(args.length!==2||key!=='*')throw Error('Uso: KEYS *');return[...this.data.keys()].filter(k=>{const e=this.data.get(k);if(e?.expires&&e.expires<=Date.now()){this.data.delete(k);return false}return true}).join('\n')||'(empty)'}
  if(op==='FLUSHDB'){if(args.length!==1)throw Error('Uso: FLUSHDB');this.data.clear();return'OK'}
  throw Error('Prueba SET, GET, DEL, EXISTS, INCR, EXPIRE, TTL, KEYS * o FLUSHDB.');
 }
}
