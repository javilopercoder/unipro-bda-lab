// Nombres y apellidos ficticios y reproducibles: no se usan datos personales reales.
const given=['Vega','Gael','Nora','Leo','Alma','Izan','Clara','Bruno','Lara','Hugo','Inés','Darío','Olivia','Mateo','Iris','Adrián','Elena','Noa','Enzo','Aitana','Nicolás','Mara','Diana','Lucas','Celia','Eric','Jimena','Álex','Valeria','Teo','Amira','Marco','Ada','Sofía','Rocío','Martín','Violeta','Pau','Abril','Elías'];
const surnames=['Salcedo','Ledesma','Montalbán','Soler','Aguirre','Valcárcel','Pardo','Aranda','Montero','Izquierdo','Ferrer','Robles','Castaño','Núñez','Peña','Campos','Navarro','Iglesias','Miralles','Rey','Vidal','Cabrera','Prieto','Serrano','Molina','Rojas','Suárez','Cuenca','Herrero','Giménez','Mora','Santos','Blanco','Linares','León','Calvo','Flores','Acosta','Gil','Romero'];
export const FIRST_NAMES=Object.freeze(given);
export const LAST_NAMES=Object.freeze(surnames);
export function fictionalName(id){
  const n=Number(id)||1;
  const a=given[(n*17+3)%given.length],b=surnames[(n*13+7)%surnames.length];
  const c=surnames[(n*19+11)%surnames.length];
  return a+' '+b+(n%5===0?' '+c:'');
}
export function fictionalEmail(id){return 'persona'+String(id).padStart(4,'0')+'@ejemplo.test'}
