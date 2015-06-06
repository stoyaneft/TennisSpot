var Router = (function(){

    // url, callback, default
    var routes = [];

    var addRoute = function(route){
        routes.push(route)
    }

    var init = function(){
        $(window).on("hashchange",function(){
             url = location.hash.slice(1) || '/';
             console.log(url);
             routes.forEach(function(route){
                if(route.url == url){
                    route.callback();
                }
             })
        });

        // trigger default route's callback
        routes.forEach(function(route){
            if(route.default === true){
                route.callback();
            }
        })
    }

    return {
        addRoute: addRoute,
        init: init
    }

})()
