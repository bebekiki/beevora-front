app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'app/pages/home.html',
            controller: 'homeCtrl'
        })
        .when('/music/:id', {
            templateUrl: 'app/pages/music.html',
            controller: 'musicCtrl'
        })
        .when('/albumsArtist', {
            templateUrl: 'app/pages/albumsArtist.html',
            controller: 'albumsArtistCtrl'
        })
        .otherwise({redirectTo: '/home'});
});