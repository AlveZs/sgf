angular.module('setor', ['login'])
  .service('setorService', SetorService)

  .component('setorHome', {
    template: '<div class="container"><h2>Setor Center</h2></div><ng-outlet></ng-outlet>',
    $routeConfig: [
      {path:'/',    name: 'SetorList',   component: 'setorList', useAsDefault: true},
      {path:'/add', name: 'SetorAdd',   component: 'setorAdd'},
      {path:'/:id', name: 'SetorDetail', component: 'setorDetail'}
    ]
  })

  
  .component('setorList', {
    templateUrl: '/templates/setorList.html',
    bindings: { $router: '<' },
    controller: SetorListComponent,
    $canActivate: function($nextInstruction, $prevInstruction) {
      console.log('$canActivate', arguments);
    }
  })

  
  .component('setorDetail', {
    templateUrl: '/templates/setorDetail.html',
    bindings: { $router: '<' },
    controller: SetorDetailComponent
    })
  
    
  .component('setorAdd', {
    templateUrl: '/templates/setorAdd.html',
    bindings: { $router: '<' },
    controller: SetorAddComponent
  });

function SetorService($http) {
  var API_URI = "api/setor";

  this.getSetores = function() {
    return setoresPromise = $http.get(API_URI)
    .then(function (response){
        return response.data;
    }).catch(function(response) {
      console.error('Error occurred:', response.status, response.data);
    });
  };

  this.postSetor = function(nomeSetor) {
    console.log("Parametro: " + nomeSetor);
    return $http({
      url: API_URI,
      method: "POST",
      data: { "nome" : nomeSetor }
    })
    .then(function(response) {
            return response;
    }, 
    function(response) { 
            console.log(response);
    });
  };

  this.putSetor = function(setor, nomeSetor) {
    return $http({
      url: 'api/setor/'+ setor.setor_id,
      method: "PUT",
      data: {'nome': nomeSetor}
    }).then(function(response) {
        console.log(response);
      }, function(response){
        console.log(response);
      });
  }

  this.deleteSetor = function(id) {
    return $http({
      url: 'api/setor/'+ id,
      method: "DELETE",
    }).then(function(response) {
        console.log(response);
      }, function(response){
        console.log(response);
      });
  };

  this.getSetor = function(id) {
    return setoresPromise.then(function(setores) {
      for (var i = 0; i < setores.length; i++) {
        if (setores[i].setor_id === id) return setores[i];
      }
    });
  };
}   

function SetorListComponent(setorService) {
  var selectedId = null;
  var ctrl = this;
  var btndel = false;

  this.$routerOnActivate = function(next) {
    console.log('$routerOnActivate', this, arguments);
    setorService.getSetores().then(function(setores) {
      ctrl.setores = setores;
      selectedId = next.params.setor_id;
    });
  };

  this.$routerOnReuse = function() {
    console.log('$routerOnReuse', this, arguments);
    if(btndel === true) {
      setorService.getSetores().then(function(setores) {
        ctrl.setores = setores;
      });
      btndel = false;
    }
  }
  
  this.btnDelete = function(id) {
    setorService.deleteSetor(id).then(function(response) {
      console.log(response);
      btndel = true;
      ctrl.$router.navigate(['SetorList']);
    });
  };

  this.isSelected = function(setores) {
    return (setores.setor_id === selectedId);
  };

  this.onSelect = function(setores) {
    this.$router.navigate(['SetorDetail', { id: setores.setor_id }]);
  };
  this.addSetor = function() {
    this.$router.navigate(['SetorAdd']);
  };
}

function SetorAddComponent( $scope, setorService, $location ) {
  var ctrl = this;
  $scope.submitSetorForm = function() {
    setorService.postSetor(ctrl.nomeSetor).then(function(){
      console.log("Funcao concluida");
      ctrl.$router.navigate(['SetorList']);
    });
    
  }
}

function SetorDetailComponent(setorService) {
  var ctrl = this;
  this.$routerOnActivate = function(next) {
    var id = next.params.id;
    setorService.getSetor(id).then(function(setor) {
      if (setor) {
        ctrl.editName = setor.set_nome;
        ctrl.setor = setor;
      } else {
        ctrl.gotoSetor();
      }
    });
  };

  this.cancel = function() {
    ctrl.editName = ctrl.setor.set_nome;
    ctrl.gotoSetor();
  };

  this.save = function() {
    
    setorService.putSetor(ctrl.setor,ctrl.editName).then(function(){
      console.log("Funcao concluida");
    })
    ctrl.gotoSetor();

  };

  this.gotoSetor = function() {
    var setorId = ctrl.setor && ctrl.setor.setor_id;
    this.$router.navigate(['SetorList', {id: setorId}]);
  };
}