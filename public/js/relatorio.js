angular.module('relatorio', [])
  .service('relatorioService', RelatorioService)

  .component('relatorioHome', {
    template: '<div class="container"></div><ng-outlet></ng-outlet>',
    $routeConfig: [
      {path:'/',    name: 'RelatorioIndex',   component: 'relatorioIndex', useAsDefault: true},
      {path:'/dados', name: 'Relatorio',   component: 'relatorio'}
    ]
  })

  
  .component('relatorioIndex', {
    templateUrl: '/templates/relatorioIndex.html',
    bindings: { $router: '<' },
    controller: RelatorioIndexComponent,
    $canActivate: function($nextInstruction, $prevInstruction) {
      console.log('$canActivate', arguments);
    }
  })

  .component('relatorio', {
    templateUrl: '/templates/relatorio.html',
    bindings: { $router: '<' },
    controller: RelatorioComponent
    })


function RelatorioService($http, $window) {
  var API_URI = "api/";

  this.getSetores = function() {
    return setoresPromise = $http.get(API_URI + 'setor')
    .then(function (response){
        return response.data;
    }).catch(function(response) {
      console.error('Error occurred:', response.status, response.data);
    });
  };

  this.getCargos = function() {
    return cargosPromise = $http.get(API_URI + 'cargo')
    .then(function (response){
        return response.data;
    }).catch(function(response) {
      console.error('Error occurred:', response.status, response.data);
    });
  };

  this.getInfosRel = function(url_api) {
    $window.open(url_api);
  };

}   

function RelatorioIndexComponent(relatorioService) {
  var selectedId = null;
  var ctrl = this;
  var btndel = false;

  this.$routerOnActivate = function(next) {
    relatorioService.getCargos().then(function(cargos) {
        ctrl.cargos = cargos;
    });
    relatorioService.getSetores().then(function(setores) {
        ctrl.setores = setores;
    });
  };
  
  this.btnDelete = function(id) {
    setorService.deleteSetor(id).then(function(response) {
      console.log(response);
      btndel = true;
      ctrl.$router.navigate(['SetorList']);
    });
  };

  this.btnGerar = function() {
    var setor = "";
    var cargo = "";
    if (typeof ctrl.func !== 'undefined'){
        if (typeof ctrl.func.cargo === 'undefined' ){
            setor = ctrl.func.setor;
        } else  if (typeof ctrl.func.setor === 'undefined'){
            cargo = ctrl.func.cargo;
        } else {
            setor = ctrl.func.setor;
            cargo = ctrl.func.cargo;
        }
    }
    ctrl.$router.navigate(['Relatorio', { setor: setor, cargo: cargo}]);
  };

  this.isSelected = function(setores) {
    return (setores.setor_id === selectedId);
  };

  this.onSelect = function(setores) {
    this.$router.navigate(['Relatorio', { funcionario: ctrl.func }]);
  };
  this.addSetor = function() {
    this.$router.navigate(['SetorAdd']);
  };
}

function RelatorioComponent(relatorioService) {
    var ctrl = this;
    var setor;
    var cargo;
    var valor = 0;
    this.$routerOnActivate = function(next) {
        setor = next.params.setor;
        cargo = next.params.cargo;
        url_api = "http://localhost:8000/api/funcionario/";
        if (setor != "" && cargo != ""){
            relatorioService.getInfosRel(url_api + 'rel/' + setor + '/' + cargo)
        } else if (setor != "" && cargo == ""){
            relatorioService.getInfosRel(url_api + 'set/' + setor)
        } else if (setor == "" && cargo != ""){
            relatorioService.getInfosRel(url_api +'car/' + cargo)
        } else {
            relatorioService.getInfosRel(url_api + 'rel');
        }
    };

    this.setValues = function(funcionarios) {
        ctrl.funcionarios = funcionarios
        angular.forEach(ctrl.funcionarios,function(value,key){
            valor += (parseFloat(value.fun_salario));
        });
        ctrl.valorTotal = valor;
    }

    this.voltar = function() {
      this.$router.navigate(['RelatorioIndex']);
    }
}