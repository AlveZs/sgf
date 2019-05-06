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
               window.alert('Usuário cadastrado com sucesso');
            }).catch(function (response) {
              if(response.data.error){
                window.alert('As senhas digitadas devem ser iguais');
              }else{
                window.alert('Erro. Não foi possível registrar');
              } 
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