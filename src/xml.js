export function executeXPath(xml,path){
 if(xml.length>20000||path.length>1000)throw Error('Entrada demasiado grande.');
 if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Este ejercicio no admite DTD ni entidades externas.');
 const doc=new DOMParser().parseFromString(xml,'application/xml');
 if(doc.querySelector('parsererror'))throw Error('El XML no está bien formado.');
 const result=doc.evaluate(path,doc,null,XPathResult.ANY_TYPE,null);const values=[];
 if(result.resultType===XPathResult.STRING_TYPE)return[result.stringValue];
 if(result.resultType===XPathResult.NUMBER_TYPE)return[result.numberValue];
 if(result.resultType===XPathResult.BOOLEAN_TYPE)return[result.booleanValue];
 let node;while((node=result.iterateNext())){values.push(node.nodeType===2||node.nodeType===3?node.nodeValue:node.textContent);if(values.length>200)throw Error('Demasiados resultados.')}
 return values;
}
export function evaluateXPath(xml,path,id){
 const r=executeXPath(xml,path);if(id==='x1')return r.length===3&&['Alba','Luis','Eva'].every(x=>r.includes(x));
 if(id==='x2')return r.length===3&&['P001','P002','P003'].every(x=>r.includes(x));
 if(id==='x3')return r.length===1&&r[0]==='Luis';return null;
}
