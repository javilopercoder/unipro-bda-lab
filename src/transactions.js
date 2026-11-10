export class BankSim{
 constructor(){this.reset()}
 reset(){this.balances={Ana:1000,Luis:500};this.pending=null;this.saves=[];this.history=[];return this.status()}
 status(){return{balances:{...(this.pending??this.balances)},active:!!this.pending,history:this.history.slice(-12)}}
 apply(action,{amount}={}){
  const done=message=>{this.history.push(message);return this.status()};
  if(action==='BEGIN'){if(this.pending)throw Error('Ya existe una transacción');this.pending={...this.balances};this.saves=[];return done('BEGIN')}
  if(action==='SAVEPOINT'){if(!this.pending)throw Error('Primero BEGIN');this.saves.push({...this.pending});return done('SAVEPOINT punto1')}
  if(action==='TRANSFER'){if(!this.pending)throw Error('Primero BEGIN');const n=Number(amount);if(!Number.isFinite(n)||n<=0||n>1000)throw Error('Importe no válido');if(n>this.pending.Ana)throw Error('Saldo insuficiente');this.pending.Ana-=n;this.pending.Luis+=n;return done('TRANSFER Ana → Luis: '+n+' €')}
  if(action==='ROLLBACK TO'){if(!this.pending||!this.saves.length)throw Error('No existe SAVEPOINT');this.pending={...this.saves.at(-1)};return done('ROLLBACK TO punto1')}
  if(action==='COMMIT'){if(!this.pending)throw Error('No hay transacción');this.balances={...this.pending};this.pending=null;this.saves=[];return done('COMMIT')}
  if(action==='ROLLBACK'||action==='CRASH'){if(!this.pending&&action==='ROLLBACK')throw Error('No hay transacción');this.pending=null;this.saves=[];return done(action==='CRASH'?'Fallo simulado; cambios no confirmados descartados':'ROLLBACK')}
  throw Error('Operación desconocida');
 }
}
