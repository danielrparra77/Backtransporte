var { Conductor } = require('./conductor');


module.exports.conductorModule= (function(router) {
    'use strict';
    Conductor = new Conductor();

    router.post('/crearConductor', function (req, res) {
        console.log('api crearConductor', req.body.data);
        var data;
        if (req.body.data instanceof Object) {
          data = req.body.data;
        } else {
          data = JSON.parse(req.body.data);
        }
        Conductor.insertarConductores(data).then(response=>{
            res.json({success:true,response});
        }).catch(e=>{
            res.json(e);
        });
      
    });
    
    router.post('/consultarConductores', function (req, res) {
      console.log('api consultarConductores', req.body.data);
      var data;
      if (req.body.data instanceof Object) {
        data = req.body.data;
      } else {
        data = JSON.parse(req.body.data);
      }
      Conductor.obtenerConductores(data).then(response=>{
          res.json({success:true,response});
      }).catch(e=>{
          res.json(e);
      });
    
  });
});