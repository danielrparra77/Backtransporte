const fs = require('fs');

const ORIGEN = './componentes/conductores/conductores.json';

class Conductor {

    constructor(){
        this.cargarConductores();
    }

    cargarConductores(){
        let self = this;
        return new Promise((resolve,reject)=>{
            fs.readFile(ORIGEN, (err, data) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                self.conductores = JSON.parse(data);
                self.cantidadConductores = 0;
                self.conductores.map(v=>{
                    self.cantidadConductores += v.conductores.length;
                });
                return resolve(true);
            });
        });
    }

    guardarConductores(){
        return new Promise ((resolve,reject)=>{
            let data = JSON.stringify(this.conductores);
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

    insertarConductores(data){
        let self = this;
        return new Promise(async (resolve,reject)=>{
            try{
                let nuevoConductor = data.nuevoConductor;
                nuevoConductor.id_conductor = self.cantidadConductores+1;
                let vehiculo = self.conductores
                    .filter(v=>v.id_vehiculo==data.id_vehiculo);
                if (vehiculo.length>0)
                    vehiculo.map(v=>{
                        v.conductores.push(nuevoConductor);
                    });
                else
                    self.conductores.push({
                        "id_vehiculo":data.id_vehiculo,
                        "conductores":[nuevoConductor]
                    });
                await self.guardarConductores();
                self.cantidadConductores+=1;
                return resolve({id_conductor:nuevoConductor.id_conductor});
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }

    obtenerConductores(data){
        let self = this;
        return new Promise(async (resolve,reject)=>{
            try{
                let conductores = self.conductores.filter(v=>v.id_vehiculo==data.id_vehiculo);
                if (conductores.length<=0)
                    return reject(false);
                return resolve({conductores:conductores[0]});
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }
}

module.exports.Conductor = Conductor;