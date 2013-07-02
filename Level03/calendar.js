(function($) {
    var current_date;
    var calendar;
    var leftButton;
    var todayButton;
    var rightButton;

    var animationTimeStep  = 100;

    var DIV_TAG            = '<div></div>';
    var LI_TAG             = '<li></li>';
    var UL_TAG             = '<ul></ul>';
    var YEARCLASS          = 'year-num';
    var MONTHCLASS         = 'month-num';
    var TITLECLASS         = 'title';
    var BODYCLASS          = 'body';
    var WEEKCLASS          = 'week';
    var DAYCLASS           = 'day-num';
    var DATECLASS          = 'date';
    var AGENDACLASS        = 'agenda';
    var TASKCLASS          = 'task';
    var HOSTCLASS          = 'host';
    var LOCATIONCLASS      = 'location';
    var DESCRIPTIONCLASS   = 'description';
    var TODAYID            = 'today';
    var HIDDENCLASS        = 'hidden';
    var DETAILCLASS        = 'detail';
    var TOPLEFTBORDERCLASS = 'top-left-border';
    var BOTTOMBORDERCLASS  = 'bottom-border';
    var RIGHTBORDERCLASS   = 'right-border';
    var LEFTMONTHCLASS     = 'month-left';
    var TODAYBUTTONCLASS   = 'today-button';
    var RIGHTMONTHCLASS    = 'month-right';
    var MONTHS = {
      "1":  { "long": "January",   "short": "Jan", "days": "31" },
      "2":  { "long": "February",  "short": "Feb", "days": "28" },
      "3":  { "long": "March",     "short": "Mar", "days": "31" },
      "4":  { "long": "April",     "short": "Apr", "days": "30" },
      "5":  { "long": "May",       "short": "May", "days": "31" },
      "6":  { "long": "June",      "short": "Jun", "days": "30" },
      "7":  { "long": "July",      "short": "Jul", "days": "31" },
      "8":  { "long": "August",    "short": "Aug", "days": "31" },
      "9":  { "long": "September", "short": "Sep", "days": "30" },
      "10": { "long": "October",   "short": "Oct", "days": "31" },
      "11": { "long": "November",  "short": "Nov", "days": "30" },
      "12": { "long": "December",  "short": "Dec", "days": "31" }
    };

    function createDay (_date, _month) {
        var self = this;

        var dayElement = $(DIV_TAG).addClass(DAYCLASS + _date);

        if (typeof _date !== 'undefined' && _date !== null) {
            if (_date > 0 && _date <= MONTHS[_month].days) {
                var dateElement = $(DIV_TAG).addClass(DATECLASS)
                                            .text(_date);
                var agendaElement = $(UL_TAG).addClass(AGENDACLASS);

                dayElement.append(dateElement)
                          .append(agendaElement);
            } else {
                dayElement.addClass(HIDDENCLASS);
            }
        }

        return dayElement;
    }

    function createWeek(_days) {
        var self = this;

        var weekElement = $(DIV_TAG).addClass(WEEKCLASS);
        for (var i = 0; i < _days.length; ++i) {
            weekElement.append(_days[i]);
        }

        return weekElement;
    }

    function createMonthFromDate (_date) {
        return createMonth(_date.getMonth(), date.getFullYear());
    }

    function createMonth(_month, _year, _firstday) {
        var self = this;

        if (typeof _month === 'undefined' || _month === null) {
            _month = (new Date()).getMonth() + 1;
        }

        if (typeof _year === 'undefined' || _year === null) {
            _year = (new Date()).getFullYear();
        }

        if (typeof _firstday === 'undefined' || _firstday === null) {
            _firstday = (new Date(_year + '/' + _month + '/' + '1')).getDay();
        }

        var monthElement = $(DIV_TAG).addClass(MONTHCLASS+_month);
        var titleElement = $(DIV_TAG).addClass(TITLECLASS).text(MONTHS[_month].long + ' - ' + _year);
        var monthBodyElement = $(DIV_TAG).addClass(BODYCLASS);

        monthElement.append(titleElement, monthBodyElement);
        var numDays = MONTHS[_month].days;

        for (var i = 1 - _firstday; i <= numDays; i += 7) {
            var days = [];
            for (var j = 0; j < 7; ++j) {
                days.push(createDay(i + j, _month));
            }
            monthBodyElement.append(createWeek(days));
        }

        return monthElement;
    }

    function createYear (_year) {
        var self = this;

        var year = $(DIV_TAG).addClass(YEARCLASS + _year);
        for (var i = 1; i < 13; ++i) {
            year.append(createMonth(i, _year));
        }
        return year;
    }

    function createYearFromDate (_date) {
        return createYear(_date.getFullYear());
    }

    function _c (c) { return '.' + c; }
    function _i (i) { return '#' + i; }

    function yearSelector (_date) {
        return _c(YEARCLASS) + (_date.getFullYear());
    }

    function monthSelector(_date) {
        return _c(MONTHCLASS) + (_date.getMonth() + 1);
    }

    function daySelector (_date) {
        return _c(DAYCLASS) + (_date.getDate());
    }

    function yearMonthSelector (_date) {
        return yearSelector(_date) + ' ' + monthSelector(_date);
    }

    function monthDaySelector(_date) {
        return monthSelector(_date) + ' ' + daySelector(_date);
    }

    function yearMonthDaySelector (_date) {
        // alert(yearSelector (_date) + ' ' +
        //        monthSelector(_date) + ' ' +
        //        daySelector  (_date));
        return yearSelector (_date) + ' ' +
               monthSelector(_date) + ' ' +
               daySelector  (_date);
    }

    function compositeSelector () {
        if (arguments.length > 0) {
            var selector = arguments[0];
            for (var i = 1; i < arguments.length; ++i) {
                selector += ' ' + arguments[i];
            }
            return selector;
        }
        return undefined;
    }

    function highlightTodayWithin(_calendar) {
        _calendar.find(yearMonthDaySelector(new Date()))
                 .attr('id', TODAYID);
    }

    function addEventsToCalendar(_events, _calendar) {
        $.each(_events, function (_index, _element) {
            var task        = $(LI_TAG)
                                .addClass(TASKCLASS);

            var host        = $(DIV_TAG)
                                .addClass(HOSTCLASS)
                                .text(_element.Host);
            var location    = $(DIV_TAG)
                                .addClass(LOCATIONCLASS)
                                .text(_element.Location);
            var description = $(DIV_TAG)
                                .addClass(DESCRIPTIONCLASS)
                                .text(_element.Description);

            task.append(host, location, description);

            var rawDate = _element.Date;
            if (rawDate.split(' ').length < 3) {
                rawDate += ' ' + current_date.getFullYear();
            }
            var agenda = _calendar
                            .find(yearMonthDaySelector(new Date(rawDate)))
                            .find('.' + AGENDACLASS);
            agenda.append(task);
        });
    }

    // Detail modification
    function displayEventDetail () {
        var self = $(this);
        var detail = $(_i(DETAILCLASS));
        detail.html(self.find('.' + AGENDACLASS).clone());
    }
    function hideEventDetail () {
        var detail = $(_i(DETAILCLASS));
        detail.empty();
    }

    // Navigation
    function goPreviousMonth () {
        var prev_month = new Date(current_date.getTime());
        prev_month.setMonth(prev_month.getMonth() - 1);
        gotoDate(prev_month);
    }
    function goNextMonth () {
        var next_month = new Date(current_date.getTime());
        next_month.setMonth(next_month.getMonth() + 1);
        gotoDate(next_month);
    }
    function goToday() {
        gotoDate(new Date());
    }
    function gotoDate (_date) {
        if (current_date.toDateString() !== _date.toDateString()) {
            current_date = _date;
            animateCalendar();
        }
    }

    // Calendar manipulation
    function animateCalendar() {
        hideEventDetail();
        calendar.find("[class^='month-num']").fadeOut(0);
        var current_month = calendar.find(yearMonthSelector(current_date));
        if (current_month.length < 1) {
            initializeCalendar();
            current_month = calendar.find(yearMonthSelector(current_date));
        }
        current_month.fadeIn(animationTimeStep);
    }

    function initializeCalendar () {
        var year = createYear(current_date.getFullYear());
        calendar.html(year);
        highlightTodayWithin(calendar);
        addEventsToCalendar(events, calendar);
        hideEventDetail();

        animateCalendar();
    }

    function wireEvents (argument) {
        calendar.on('click', "[class^='day-num']", displayEventDetail);
        leftButton.on('click', goPreviousMonth);
        todayButton.on('click', goToday);
        rightButton.on('click', goNextMonth);
    }

    $(function () {
        calendar     = $(_i('mainCalendar'));
        current_date = new Date();
        leftButton   = $(_c(LEFTMONTHCLASS));
        todayButton  = $(_c(TODAYBUTTONCLASS));
        rightButton  = $(_c(RIGHTMONTHCLASS));

        wireEvents();
        initializeCalendar();
    });
})(jQuery);
