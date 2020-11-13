const fs = require('fs');

const ORIGEN = './componentes/empresa/empresas.json';

class Empresa {

    constructor(){
        this.cargarEmpresas();
    }

    cargarEmpresas(){
        let self = this;
        return new Promise((resolve,reject)=>{
            fs.readFile(ORIGEN, (err, data) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                self.empresas = JSON.parse(data);
                self.cantidadEmpresas = self.empresas.length;
                return resolve(true);
            });
        });
    }

    guardarEmpresas(){
        return new Promise ((resolve,reject)=>{
            let data = JSON.stringify(this.empresas);
            fs.writeFile(ORIGEN, data, (err) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                console.log('Data written to file');
                return resolve(true);
            });
            
        });
    }

    insertarEmpresas(data){
        let self = this;
        return new Promise(async (resolve,reject)=>{
            try{
                let nuevaEmpresa = data.nuevaEmpresa;
                nuevaEmpresa.id = self.cantidadEmpresas+1;
                self.empresas.push(nuevaEmpresa);
                await self.guardarEmpresas();
                self.cantidadEmpresas+=1;
                return resolve({id:nuevaEmpresa.id});
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }

    obtenerEmpresas(){
        return new Promise(async (resolve,reject)=>{
            try{
                return resolve({empresas:this.empresas});
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }
}

module.exports.Empresa = Empresa;