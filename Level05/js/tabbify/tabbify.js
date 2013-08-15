(function ($) {
    $.fn.tabbify = function (options) {
        var self = this;

        // default
        var defaults = {
            speed: 'fast'
        };

        // set defaults
        if (options) for (var prop in options) if (defaults.hasOwnProperty)
            defaults[prop] = options[prop];

        // get references to tabs and tab content
        var tabs = $(self.children('ul tabs > li').children());
        var tab_content = $(self.children('tab-content').children());
        var active_tab = tabs.first();

        
        // hook up events

        // helper functions
        function showTab (tab_id, speed, callback) {
            active_tab = tabs.children((tab_id[0] !== '#') ? '#' + tab_id : tab_id);
            tab_content.hide(speed || defaults.speed, function () {
                active_tab.show(speed || defaults.speed, function() {
                    if (callback) callback();
                });
            });
        }

        showTab('tab-content-04');
    };

})( jQuery );
