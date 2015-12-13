requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.

    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        d3: {
            exports: 'd3'
        },
        typeahead: {
            deps: ['jquery']
        }

    },

    paths: {
        app: '../app',
        jquery: 'jquery-2.0.2.min',
        'bio-pv': 'bio-pv.min',
        bootstrap: 'bootstrap.min',
        pviz: 'pviz-amd.min',
        underscore: 'underscore.min',
        backbone: 'backbone.min',
        d3: 'd3.v3.min'
    }

});

// Start the main app logic.
requirejs(['app'], function () {

});