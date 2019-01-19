(function ($, window, document) {
    'use strict';

    var SpaceshipStopIndex = function () {
        var pub = this;
        var priv = {
            options: {
                urlSearch: ''
            }
        };

        priv.setDefaults = function (opts) {
            opts = opts || [];
            priv.options = $.extend(priv.options, opts);
        };

        priv.addOverlay = function (el, mensagem) {
            mensagem = mensagem || 'Please wait...';
            el.append('<div class="app-overlay">' + mensagem + '</div>');
        };

        priv.removeOverlay = function (el) {
            el.find('>.app-overlay').remove();
        };

        priv.init = function () {
            priv.dtSpaceship = $('#dtSpaceship').dataTable({
                processing: true,
                serverSide: false,
                ajax: {
                    url: priv.options.urlSearch,
                    type: "GET",
                    dataSrc: function (json) {
                        var data = json.results;
                        var distance = $("#distanceToStops").val() || 0;

                        for (var row in data) {
                            var distanceCalculated = 0, shipMGLT = data[row]['MGLT'];

                            distanceCalculated = Math.round(distance / data[row]['MGLT']);

                            data[row]['stops_needed'] = distanceCalculated;
                        }

                        return data;
                    }
                },
                columnDefs: [
                    {name: "name", targets: 0, data: "name"},
                    {name: "MGLT", targets: 1, data: "MGLT"},
                    {name: "starship_class", targets: 2, data: "starship_class"},
                    {name: "passengers", targets: 3, data: "passengers"},
                    {name: "stops_needed", targets: 4, data: "stops_needed"}
                ],
                "autoWidth": false,
                oLanguage: {
                    sProcessing: "<i class='fa fa-lg fa-spinner fa-spin'></i>",
                    sSearch: "Search for anything: "
                },
                drawCallback: function(settings, json){
                    priv.removeOverlay($("body"));
                }
            });

            $("#distanceToStops").on("keyup",function(){
                priv.addOverlay($("body"),
                    'Ok Captain! we are now calculating the stops needed'
                );

                priv.dtSpaceship.api().ajax.reload(null, false);
            })
        };

        pub.run = function (opts) {
            priv.setDefaults(opts);
            priv.init();
        };
    };

    $.spaceshipStopIndex = function (params) {
        params = params || [];

        var dataLocation = "starwars.templates.spaceship-stop.index.html.twig",
            obj = $(window).data(dataLocation);

        if (!obj) {
            obj = new SpaceshipStopIndex();
            obj.run(params);
            $(window).data(dataLocation, obj);
        }

        return obj;
    };
})(window.jQuery, window, document);

$(document).ready(function() {
    $.spaceshipStopIndex({
        urlSearch: "https://swapi.co/api/starships"
    });
} );