var { Vehiculo } = require('./vehiculo');


module.exports.vehiculoModule= (function(router) {
    'use strict';
    Vehiculo = new Vehiculo();

    router.post('/crearVehiculo', function (req, res) {
        console.log('api crearVehiculo', req.body.data);
        var data;
        if (req.body.data instanceof Object) {
          data = req.body.data;
        } else {
          data = JSON.parse(req.body.data);
        }
        Vehiculo.insertarVehiculos(data).then(response=>{
            res.json({success:true,response});
        }).catch(e=>{
            res.json(e);
        });
      
    });
    
    router.post('/consultarVehiculos', function (req, res) {
      console.log('api consultarVehiculos', req.body.data);
      var data;
      if (req.body.data instanceof Object) {
        data = req.body.data;
      } else {
        data = JSON.parse(req.body.data);
      }
      Vehiculo.obtenerVehiculos(data).then(response=>{
          res.json({success:true,response});
      }).catch(e=>{
          res.json(e);
      });
    
  });

  router.post('/consultarVehiculosEstrategico', function (req, res) {
    console.log('api consultarVehiculosEstrategico', req.body.data);
    var data;
    if (req.body.data instanceof Object) {
      data = req.body.data;
    } else {
      data = JSON.parse(req.body.data);
    }
    Vehiculo.consultarVehiculosEstrategico(data).then(response=>{
        res.json({success:true,response});
    }).catch(e=>{
        res.json(e);
    });
  
});
});