angular.module('registro', [])
.service("registroService", RegistroService)

.component('registrar', {
    templateUrl: '/templates/registro.html',
    bindings: { $router: '<' },
    controller: RegistrarComponent,
  })

  function RegistroService($location, $http) {

    this.registrar = function (usuario) {   
        return $http({
            url: 'auth/registro',
            method: "POST",
            data: {
              "name" : usuario.nome,
              "email": usuario.email,
              "password": usuario.password,
              "c_password": usuario.password_conf
            }
          }).then(function(response){
               console.log(response);
            });
      }

  }

  function RegistrarComponent($scope,$location, registroService) {
    ctrl = this;
    $scope.registrar = function() {
      console.log($scope.credentials);
      registroService.registrar($scope.usuario).then(function(){
        $location.path('/login');
      })
    }
  }