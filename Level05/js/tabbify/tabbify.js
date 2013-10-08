(function ($) {
    $.fn.tabbify = function (config) {
        // store 'self'
        // 'self' is already a jquery object
        var self = this;

        // default options
        var defaults = {
            speed: 0,
            tab_group: '.tabs',
            tabs: '.tab',
            tab_content_group: '.tab-contents',
            tab_contents: '.tab-content',
            initial_tab: 0,
            active_class: 'tab-active'
        };
        // user-modified options
        var settings = {};

        // set options based on user preferences
        if (config) for (var prop in defaults) {
            settings[prop] = config.hasOwnProperty(prop)
                           ? config[prop]
                           : defaults[prop];
        } else {
            settings = defaults;
        }

        // var tab_group         = self.children(settings.tab_group);
        var tabs              = self.children(settings.tab_group).children(settings.tabs);                
        // var tab_content_group = self.children(settings.tab_content_group);
        var tab_contents      = self.children(settings.tab_content_group).children(settings.tab_contents);
        var active_tabs;

        var switching = false;

        // hook up events
        tabs.each(function (index, element) {
            $(element).on('click', showTab);
        });

        tab_contents.hide(0);
        $(tabs[settings.initial_tab]).trigger('click');

        // show initial tab content
        $(tab_contents).hide(0);
        $(active_tabs).show(0);

        // helper functions
        function showTab (event) {
            var thisTab = this;

            event.stopPropagation();
            event.preventDefault();

            if (!switching) {
                switching = true;

                var _for = $(this).attr('for');

                var targets = [];
                // hide all unselected elements
                $(tab_contents).each(function (index, element) {
                    var $elem = $(element);
                    // if element has class or id matching
                    //  'for' attribute of the clicked tab
                    if ($elem.hasClass(_for) ||
                        $elem.attr('id') === _for) {
                        // add contents to 'targets'
                        targets.push(element);
                    }
                    // nothing matches 'for' element of clicked tab
                    else {
                        // hide element
                        $elem.fadeOut(settings.speed);
                    }
                // show all selected elements
                }).promise().done(function () {
                    // $(tabs).each(function (index, element) {
                    //     $(element).removeClass(settings.active_class);
                    // });
                    $(tabs).removeClass(settings.active_class);
                    $(thisTab).addClass(settings.active_class);
                    $(targets).fadeIn(settings.speed);
                // set active tab
                }).promise().done(function () {
                    active_tabs = targets;
                    // force tabs to reset (hacky fix for quick tab switching)
                    $(tab_contents).fadeOut(0);
                    $(active_tabs).fadeIn(0);

                    switching = false
                    ;
                });
            }
        }
    };
})( jQuery );
