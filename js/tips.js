
define(function (require) {

    var ko = require('knockout');

    ko.bindingHandlers.tips = {
        init: function (element, valueAccessor, allBindingsAccessor) {

            var settings = ko.utils.unwrapObservable(valueAccessor());

        },
        update: function (element, valueAccessor, allBindingsAccessor) {

        }
    };
});