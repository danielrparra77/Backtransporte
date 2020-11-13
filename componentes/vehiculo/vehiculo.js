const fs = require('fs');
const async = require('async');

const ORIGEN = './componentes/vehiculo/vehiculos.json';

var { Empresa } = require('../empresa/Empresa');
var { Conductor } = require('../conductores/conductor');


class Vehiculo {

    constructor(){
        this.cargarVehiculos();
        Empresa = new Empresa();
        Conductor = new Conductor();
    }

    cargarVehiculos(){
        let self = this;
        return new Promise((resolve,reject)=>{
            fs.readFile(ORIGEN, (err, data) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                self.vehiculos = JSON.parse(data);
                self.cantidadVehiculos = 0;
                self.vehiculos.map(e=>{
                    self.cantidadVehiculos += e.vehiculos.length;
                });
                return resolve(true);
            });
        });
    }

    guardarVehiculos(){
        return new Promise ((resolve,reject)=>{
            let data = JSON.stringify(this.vehiculos);
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

    insertarVehiculos(data){
        let self = this;
        return new Promise(async (resolve,reject)=>{
            try{
                let nuevoVehiculo = data.nuevoVehiculo;
                nuevoVehiculo.id_vehiculo = self.cantidadVehiculos+1;
                let empresa = self.vehiculos
                    .filter(e=>e.id==data.id_empresa);
                if (empresa.length>0)
                    empresa.map(e=>{
                        e.vehiculos.push(nuevoVehiculo);
                    });
                else
                    self.vehiculos.push({
                        "id":data.id_empresa,
                        "vehiculos":[nuevoVehiculo]
                    });
                await self.guardarVehiculos();
                self.cantidadVehiculos+=1;
                return resolve({id_vehiculo:nuevoVehiculo.id_vehiculo});
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }

    obtenerVehiculos(data){
        let self = this;
        return new Promise(async (resolve,reject)=>{
            try{
                let vehiculos = self.vehiculos.filter(e=>e.id==data.id_empresa);
                if (vehiculos.length<=0)
                    return reject(false);
                return resolve({vehiculos:vehiculos[0]});
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }

    consultarVehiculosEstrategico(data){
        let self = this;
        let vehiculosEstrategico = [];
        return new Promise(async (resolve,reject)=>{
            try{
                await Empresa.cargarEmpresas();
                await Conductor.cargarConductores();
                let empresas = await Empresa.obtenerEmpresas();
                if (empresas.empresas)
                    empresas = empresas.empresas;
                async.mapSeries(self.vehiculos,function(e,callbackEmpresa) {
                    async.mapSeries(e.vehiculos,function(v,callbackVehiculo) {
                        Conductor.obtenerConductores({id_vehiculo:v.id_vehiculo}).then(conductores=>{
                            if (conductores.conductores.conductores)
                                conductores = conductores.conductores.conductores;
                            if (conductores.length<2)
                                return callbackVehiculo(null);
                            let empresa = empresas.filter(e1=>e1.id==e.id);
                            if (empresa.length<=0)
                                return callbackVehiculo(null);
                            empresa = empresa[0];
                            vehiculosEstrategico.push({
                                placa:v.placa,
                                tipoIdContEmp:empresa.contacto.tipoId,
                                numeroIdContEmp:empresa.contacto.numeroId,
                                nombreEmp:empresa.contacto.nombre,
                                cantidadConductores:conductores.length
                            });
                            return callbackVehiculo(null);
                        }).catch(e=>{
                            console.error(e);
                            return callbackVehiculo(null);
                        });
                    }, function(err, results) {
                        return callbackEmpresa(null);
                    });
                }, function(err, results) {
                    vehiculosEstrategico = vehiculosEstrategico.sort(function(a, b) {
                        return a.placa.localeCompare(b.placa);
                    });
                    return resolve({vehiculosEstrategico});
                });
            }
            catch(e){
                console.error(e);
                return reject(false);
            }
        });
    }
}

module.exports.Vehiculo = Vehiculo;