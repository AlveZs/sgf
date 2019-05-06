angular.module('funcionario', [])
  .service('funcionarioService', FuncionarioService)

  .component('funcionarioHome', {
    template: '<div class="container"></div><ng-outlet></ng-outlet>',
    $routeConfig: [
      {path:'/',    name: 'FuncionarioList',   component: 'funcionarioList', useAsDefault: true},
      {path:'/add', name: 'FuncionarioAdd',   component: 'funcionarioAdd'},
      {path:'/:id', name: 'FuncionarioDetail', component: 'funcionarioDetail'}
    ]
  })

  
  .component('funcionarioList', {
    templateUrl: '/templates/funcionarioList.html',
    bindings: { $router: '<' },
    controller: FuncionarioListComponent,
    $canActivate: function($nextInstruction, $prevInstruction) {
      console.log('$canActivate', arguments);
    }
  })

  
  .component('funcionarioDetail', {
    templateUrl: '/templates/funcionarioDetail.html',
    bindings: { $router: '<' },
    controller: FuncionarioDetailComponent
    })
  
    
  .component('funcionarioAdd', {
    templateUrl: '/templates/funcionarioAdd.html',
    bindings: { $router: '<' },
    controller: FuncionarioAddComponent
  });

function FuncionarioService($http) {
  var API_URI = "api/";

  this.getFuncionarios = function() {
    return funcionariosPromise = $http.get(API_URI + 'funcionario')
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

  this.getSetores = function() {
    return setoresPromise= $http.get(API_URI + 'setor')
    .then(function (response){
        return response.data;
    }).catch(function(response) {
      console.error('Error occurred:', response.status, response.data);
    });
  };

  this.postFuncionario = function(funcionario) {
    return $http({
      url: API_URI + 'funcionario',
      method: "POST",
      data: 
      { 
        "nome" : funcionario.nomeFunc,
        "salario": funcionario.salarioFunc,
        "data_nascimento": funcionario.dataNascFor,
        "data_contratacao": funcionario.dataContFor,
        "cargo": funcionario.cargo,
        "setor": funcionario.setor
      }
    })
    .then(function(response) {
            return response;
    }, 
    ).catch(function(response) {
      console.error('Error occurred:', response.status, response.data);
      window.alert('Não foi possível incluir');
    });
  };

  this.putFuncionario = function(funcionario) {
    return $http({
      url: 'api/funcionario/'+ funcionario.funcionario_id,
      method: "PUT",
      data: {
        "nome" : funcionario.fun_nome,
        "salario": funcionario.fun_salario,
        "data_nascimento": funcionario.dataNascFor,
        "data_contratacao": funcionario.dataContFor,
        "cargo": funcionario.cargo_id,
        "setor": funcionario.setor_id
      }
    }).then(function(response) {
        console.log(response);
      }).catch(function(response){
        window.alert('Não foi possível editar' + response.data);
      });
  }

  this.deleteFuncionario = function(id) {
    return $http({
      url: 'api/funcionario/'+ id,
      method: "DELETE",
    }).then(function(response) {
        console.log(response);
      }).catch(function(response){
        window.alert('Não foi possível excluir' + response.data);
      });
  };

  this.getFuncionario = function(id) {
    return funcionariosPromise.then(function(funcionarios) {
      for (var i = 0; i < funcionarios.length; i++) {
        if (funcionarios[i].funcionario_id === id) return funcionarios[i];
      }
    });
  };
}   

function FuncionarioListComponent(funcionarioService) {
  var selectedId = null;
  var ctrl = this;
  var btndel = false;


  this.$routerOnActivate = function(next) {
    console.log('$routerOnActivate', this, arguments);
    funcionarioService.getFuncionarios().then(function(funcionarios) {
      ctrl.funcionarios = funcionarios;
      selectedId = next.params.funcionario_id;
    });
  };

  this.$routerOnReuse = function() {
    console.log('$routerOnReuse', this, arguments);
    if(btndel === true) {
      funcionarioService.getFuncionarios().then(function(funcionarios) {
        ctrl.funcionarios = funcionarios;
      });
      btndel = false;
    }
  }

  this.btnDelete = function(id) {
    funcionarioService.deleteFuncionario(id).then(function(response) {
      console.log(response);
      btndel = true;
      ctrl.$router.navigate(['FuncionarioList']);
    });
  };

  this.isSelected = function(funcionarios) {
    return (funcionarios.funcionario_id === selectedId);
  };

  this.onSelect = function(funcionarios) {
    this.$router.navigate(['FuncionarioDetail', { id: funcionarios.funcionario_id }]);
  };
  this.addFuncionario = function() {
    this.$router.navigate(['FuncionarioAdd']);
  };
}

function FuncionarioAddComponent( $scope, funcionarioService, $filter) {
  var ctrl = this;

  this.$routerOnActivate = function(next) {
    console.log('$routerOnActivate', this, arguments);
    funcionarioService.getCargos().then(function(cargos) {
      ctrl.cargos = cargos;
    });
    funcionarioService.getSetores().then(function(setores) {
        ctrl.setores = setores;
    });
  };

  $scope.submitFuncionarioForm = function() {
    ctrl.converteDatas();
    funcionarioService.postFuncionario(ctrl.func).then(function(){
      console.log("Funcao concluida");
      ctrl.$router.navigate(['FuncionarioList']);
    });
  };

  this.converteDatas = function() {
    var dataNascimento; 
    var dataContratacao;
    dataNascimento = new Date(ctrl.func.dataNascimento);
    dataContratacao = new Date(ctrl.func.dataContratacao);
    ctrl.func.dataNascFor = $filter('date')(dataNascimento, 'yyyy-MM-dd');
    ctrl.func.dataContFor = $filter('date')(dataContratacao, 'yyyy-MM-dd');
  };
}

function FuncionarioDetailComponent(funcionarioService, $filter) {
  var ctrl = this;
  this.$routerOnActivate = function(next) {
    console.log('$routerOnActivate', this, arguments);
    var id = next.params.id;
    funcionarioService.getCargos().then(function(cargos) {
      ctrl.cargos = cargos;
    });
    funcionarioService.getSetores().then(function(setores) {
        ctrl.setores = setores;
    });
    funcionarioService.getFuncionario(id).then(function(funcionario) {
      if (funcionario) {
        ctrl.func = funcionario;
        var dataNascimento = funcionario.fun_data_nascimento.split("-");
        var dataContratacao = funcionario.fun_data_contratacao.split("-");
        ctrl.func.fun_salario = parseFloat(ctrl.func.fun_salario);
        ctrl.func.fun_data_nascimento = new Date(dataNascimento[0],dataNascimento[1],dataNascimento[2]);
        ctrl.func.fun_data_contratacao = new Date(dataContratacao[0],dataContratacao[1],dataContratacao[2]);
      } else { 
        ctrl.gotoFuncionario();
      }
    });
  };
  
  this.cancel = function() {
    ctrl.gotoFuncionario();
  };

  this.save = function() {
    ctrl.converteDatas();
    funcionarioService.putFuncionario(ctrl.func).then(function(){
      console.log("Funcao concluida");
    })
    ctrl.gotoFuncionario();

  };

  this.converteDatas = function() {
    var dataNascimento; 
    var dataContratacao;
    dataNascimento = new Date(ctrl.func.fun_data_nascimento);
    dataContratacao = new Date(ctrl.func.fun_data_contratacao);
    ctrl.func.dataNascFor = $filter('date')(dataNascimento, 'yyyy-MM-dd');
    ctrl.func.dataContFor = $filter('date')(dataContratacao, 'yyyy-MM-dd');
  };

  this.gotoFuncionario = function() {
    var funcionarioId = ctrl.funcionario && ctrl.funcionario.funcionario_id;

    this.$router.navigate(['FuncionarioList', {id: funcionarioId}]);
  };
}