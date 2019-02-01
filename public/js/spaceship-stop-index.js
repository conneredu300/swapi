(function ($, window, document) {
    'use strict';

    var SpaceshipStopIndex = function () {
        var pub  = this;
        var priv = {
            options: {
                urlSearch: '',
                next: '',
                previous: ''
            }
        };

        priv.setDefaults = function (opts) {
            opts         = opts || [];
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
                        priv.options.next     = json.next || priv.options.urlSearch;
                        priv.options.previous = json.previous || priv.options.urlSearch;

                        var data     = json.results;
                        var distance = $("#distanceToStops").val() || 0;

                        for (var row in data) {
                            var consumables        = priv.parseHour(data[row]['consumables']),
                                distanceCalculated = "unknown";

                            if (data[row]['MGLT'] != "unknown") {
                                distanceCalculated = Math.round((distance / data[row]['MGLT']) / consumables);
                            }

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
                "bPaginate": true,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": false,
                "bAutoWidth": false,
                oLanguage: {
                    sProcessing: "<i class='fa fa-lg fa-spinner fa-spin'></i>",
                    sSearch: "Search for anything: "
                },
                drawCallback: function (settings, json) {
                    $(".paginate_button").removeClass("disabled");
                    priv.removeOverlay($("body"));
                }
            });

            $("#distanceToStops").on("keyup", function () {
                priv.addOverlay($("body"),
                    'Ok Captain! we are now calculating the stops needed'
                );

                priv.dtSpaceship.api().ajax.reload(null, false);
            });

            $(document).on("click", ".paginate_button", function (e) {
                var table = $('#dtSpaceship').DataTable();

                if (e.target.id == "dtSpaceship_next") {
                    table.ajax.url(priv.options.next).load();
                }

                if (e.id == "dtSpaceship_previous") {
                    table.ajax.url(priv.options.previous).load();
                }
            });
        };

        priv.parseHour = function (time) {
            var arr = time.split(" "), unity = arr[1], value = arr[0];

            switch (unity) {
                case 'day':
                case 'days':
                    return value * 24;
                case 'week':
                case 'weeks':
                    return value * 168;
                case 'month':
                case 'months':
                    return value * 730.001;
                case "year":
                case "years":
                    return value * 8760;
                default:
                    return value;
            }
        };

        pub.run = function (opts) {
            priv.setDefaults(opts);
            priv.init();
        };
    };

    $.spaceshipStopIndex = function (params) {
        params = params || [];

        var dataLocation = "starwars.templates.spaceship-stop.index.html.twig",
            obj          = $(window).data(dataLocation);

        if (!obj) {
            obj = new SpaceshipStopIndex();
            obj.run(params);
            $(window).data(dataLocation, obj);
        }

        return obj;
    };
})(window.jQuery, window, document);

$(document).ready(function () {
    $.spaceshipStopIndex({
        urlSearch: "https://swapi.co/api/starships"
    });
});