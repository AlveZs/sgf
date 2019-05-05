angular.module('cargo', [])
  .service('cargoService', CargoService)

  .component('cargoHome', {
    template: '<div class="container"></div><ng-outlet></ng-outlet>',
    $routeConfig: [
      {path:'/',    name: 'CargoList',   component: 'cargoList', useAsDefault: true},
      {path:'/add', name: 'CargoAdd',   component: 'cargoAdd'},
      {path:'/:id', name: 'CargoDetail', component: 'cargoDetail'}
    ]
  })

  .component('cargoList', {
    templateUrl: '/templates/cargoList.html',
    bindings: { $router: '<' },
    controller: CargoListComponent,
    $canActivate: function($nextInstruction, $prevInstruction) {
      console.log('$canActivate', arguments);
    }
  })
  
  .component('cargoDetail', {
    templateUrl: '/templates/cargoDetail.html',
    bindings: { $router: '<' },
    controller: CargoDetailComponent
    })
  
    
  .component('cargoAdd', {
    templateUrl: '/templates/cargoAdd.html',
    bindings: { $router: '<' },
    controller: CargoAddComponent
  });

function CargoService($http) {
  var API_URI = "api/cargo";
  
  this.getCargos = function() {
    return cargosPromise = $http.get(API_URI)
    .then(function (response){
        return response.data;
    }).catch(function(response) {
      console.error('Error occurred:', response.status, response.data);
    });;
  };

  this.postCargo = function(nomeCargo) {
    console.log("Parametro: " + nomeCargo);
    return $http({
      url: API_URI,
      method: "POST",
      data: { "nome" : nomeCargo }
    })
    .then(function(response) {
            return response;
    }, 
    function(response) { 
            console.log(response);
    });
  };

  this.putCargo = function(cargo, nomeCargo) {
    return $http({
      url: 'api/cargo/'+ cargo.cargo_id,
      method: "PUT",
      data: {'nome': nomeCargo}
    }).then(function(response) {
        console.log(response);
      }, function(response){
        console.log(response);
      });
  }

  this.deleteCargo = function(id) {
    return $http({
      url: 'api/cargo/'+ id,
      method: "DELETE",
    }).then(function(response) {
        console.log(response);
      }, function(response){
        console.log(response);
      });
  };

  this.getCargo = function(id) {
    return cargosPromise.then(function(cargos) {
      for (var i = 0; i < cargos.length; i++) {
        if (cargos[i].cargo_id === id) return cargos[i];
      }
    });
  };
}   

function CargoListComponent(cargoService) {
  var selectedId = null;
  var ctrl = this;
  var btndel = false;

  this.$routerOnActivate = function(next) {
    console.log('$routerOnActivate', this, arguments);
    cargoService.getCargos().then(function(cargos) {
      ctrl.cargos = cargos;
      selectedId = next.params.cargo_id;
    });
  };

  this.$routerOnReuse = function() {
    if(btndel === true) {
      console.log('$routerOnReuse', this, arguments);
      cargoService.getCargos().then(function(cargos) {
        ctrl.cargos = cargos;
      });
      btndel = false;
    }
  };

  this.btnDelete = function(id) {
    cargoService.deleteCargo(id).then(function(response) {
      console.log(response);
      btndel = true;
      ctrl.$router.navigate(['CargoList']);
    });  
  };

  this.isSelected = function(cargos) {
    return (cargos.cargo_id === selectedId);
  };

  this.onSelect = function(cargos) {
    this.$router.navigate(['CargoDetail', { id: cargos.cargo_id }]);
  };
  this.addCargo = function() {
    this.$router.navigate(['CargoAdd']);
  };
}

function CargoAddComponent( $scope, cargoService) {
  var ctrl = this;
  $scope.submitCargoForm = function() {
    cargoService.postCargo(ctrl.nomeCargo).then(function(){
      console.log("Funcao concluida");
      ctrl.$router.navigate(['CargoList']);
    });
  }
}

function CargoDetailComponent(cargoService) {
  var ctrl = this;
  this.$routerOnActivate = function(next) {
    console.log('$routerOnActivate', this, arguments);
    var id = next.params.id;
    cargoService.getCargo(id).then(function(cargo) {
      if (cargo) {
        ctrl.editName = cargo.car_nome;
        ctrl.cargo = cargo;
      } else { 
        ctrl.gotoCargo();
      }
    });
  };

  this.cancel = function() {
    ctrl.editName = ctrl.cargo.car_nome;
    ctrl.gotoCargo();
  };

  this.save = function() {
    
    cargoService.putCargo(ctrl.cargo,ctrl.editName).then(function(){
      console.log("Funcao concluida");
    })
    ctrl.gotoCargo();

  };

  this.gotoCargo = function() {
    var cargoId = ctrl.cargo && ctrl.cargo.cargo_id;
    this.$router.navigate(['CargoList', {id: cargoId}]);
  };
}