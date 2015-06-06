"use strict"

// crud

var TournamentsCtrl = (function(){

    var tournamentsRes = new Resource("/api/tournaments");

    var list = function(){
        return tournamentsRes.query().then(function(result){
            var container = $("#content");
            var tplName = "views/admin/tournaments.jade"
            var events = formatList(result.list);
            var data = {
                tournaments: tournaments
            };

            return helpers.displayWithJade(container, tplName, data);
        })
    }

    var reset = function(){
        $('#tournaments-form').trigger("reset");
        $('#tournaments-form').find("[name=_id]").val("");
    }

    var edit = function(id){
        tournamentsRes.view(id).then(function(data){
            Object.keys(data).forEach(function(field){
                var formElement = $("[name="+field+"]");
                var value = data[field];
                if(field == "date"){
                    value = moment(value).format("YYYY-MM-DD");
                }
                formElement.val(value);
            })
        })
    }

    var save = function(data){

        var id = data._id || "";
        delete(data._id);

        // if id update
        if(id !== ""){

            tournamentsRes.update(id, data)
                .then(function(){
                    console.log("Updated Successfuly!")
                    list();
                })
        // else create
        } else {
            tournamentsRes.create(data)
                .then(function(){
                    console.log("Created Successfuly!")
                    list();
                })
        }

    }

    var remove = function(id){
        tournamentsRes.delete(id).then(function(){
            console.log("Deleted "+id+" successfuly!");
            list();
        })
    }

    var init = function(){

        $("#content").on("submit", "#tournaments-form",function(event){
            var data = helpers.getDataFromForm($(this));
            save(data);
            event.preventDefault();
        })

        $("#content").on("click", ".action-reset",function(event){
            reset();
        })

        $("#content").on("click", ".action-delete", function(){
            var id = $(this).data("id");
            remove(id);
        })

        $("#content").on("click", ".action-edit", function(){
            var id = $(this).data("id");
            edit(id);
        })

        return list();

    }

    return {
        list: list,
        reset: reset,
        edit: edit,
        save: save,
        remove: remove,
        init: init
    };

}());
