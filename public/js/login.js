angular.module('login', [])
.service("sessionService", SessionService)
  .service("authenticationService", AuthenticationService)

.component('login', {
    templateUrl: '/templates/login.html',
    bindings: { $router: '<' },
    controller: LoginComponent,
  })

  .run(function($rootScope, $location, authenticationService){
    var routesThatRequireAuth = ['/cargo','/setor','/funcionario','/relatorio'];
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      angular.forEach(routesThatRequireAuth, function(value) {
        if((value.match($location.path())) && !authenticationService.isLoggedIn()) {
          $location.path('/login');
        }
      })
    })
  });


  function SessionService () {
    return {
      get: function(key) {
        return sessionStorage.getItem(key);
      },
      set: function(key, val) {
        return sessionStorage.setItem(key, val);
      },
      unset: function(key) {
        return sessionStorage.removeItem(key);
      }
    }
  }

  function AuthenticationService($location, $http, sessionService) {
    var cacheSession = function() {
      sessionService.set('authenticated', true);
    };
    var uncacheSession = function() {
      sessionService.unset('authenticated');
    }

    return {
      login: function (credentials) {
        var login = $http.post("auth/login", credentials);
        login.then(cacheSession);
        return login;
      },
      logout: function() {
        var logout = $http.get("auth/logout");
        logout.then(uncacheSession);
        return logout;
      },
      isLoggedIn: function() {
        return sessionService.get('authenticated');
      }
    }
  }

  function LoginComponent($rootScope,$scope,$location, authenticationService) {
    ctrl = this;
    ctrl.credentials = {email: "", password: ""};
    $scope.login = function() {
      authenticationService.login($scope.credentials).then(function(){
        $rootScope.barra = 'autenticado';
        $location.path('/cargo');
      })
    }

    $scope.registrar = function() {
        $location.path('/registro');
    }
  }