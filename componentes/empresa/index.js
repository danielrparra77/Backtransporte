var { Empresa } = require('./Empresa');


module.exports.empresaModule= (function(router) {
    'use strict';
    Empresa = new Empresa();

    router.post('/crearEmpresa', function (req, res) {
        console.log('api crearEmpresa', req.body.data);
        var data;
        if (req.body.data instanceof Object) {
          data = req.body.data;
        } else {
          data = JSON.parse(req.body.data);
        }
        Empresa.insertarEmpresas(data).then(response=>{
            res.json({success:true,response});
        }).catch(e=>{
            res.json(e);
        });
      
    });
    
    router.post('/consultarEmpresas', function (req, res) {
      console.log('api consultarEmpresas', req.body.data);
      var data;
      if (req.body.data instanceof Object) {
        data = req.body.data;
      } else {
        data = JSON.parse(req.body.data);
      }
      Empresa.obtenerEmpresas(data).then(response=>{
          res.json({success:true,response});
      }).catch(e=>{
          res.json(e);
      });
    
  });
});