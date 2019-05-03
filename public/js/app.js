angular.module('app', ['ngComponentRouter', 'registro','login','cargo','setor', 'funcionario', 'relatorio'])

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
  

  .value('$routerRootComponent', 'app') 


  .component('app', {
    templateUrl:'/templates/app.html',
    $routeConfig: [
      {path: '/login', name: 'Login', component: 'login', useAsDefault: true},
      {path: '/registro', name: 'Registro', component: 'registrar'},
      {path: '/cargo/...', name: 'Cargo', component: 'cargoHome'},
      {path: '/setor/...', name: 'Setor', component: 'setorHome'},
      {path: '/funcionario/...', name: 'Funcionario', component: 'funcionarioHome'},
      {path: '/relatorio/...', name: 'Relatorio', component: 'relatorioHome'},
    ],
    controller: AppComponent
  });

  function AppComponent($rootScope, $scope, authenticationService, $location){
    $rootScope.barra = "";
    console.log($rootScope);

    $scope.logout = function() {
      authenticationService.logout().then(function() {
        $rootScope.barra = '';
        $location.path('/login');
      });
    };
  }