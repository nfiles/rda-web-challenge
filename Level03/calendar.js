(function($) {
    var current_date;
    var calendar;
    var detail;
    var displayEvents;
    var leftButton;
    var todayButton;
    var rightButton;
    var newTaskButton;
    var editTaskDetails;
    var inputDetailDate;
    var inputHost;
    var inputLocation;
    var inputDescription;
    var errorDetailDate;
    var errorHost;
    var errorLocation;
    var submitTaskButton;
    var openTaskIndex;

    var animationTimeStep     = 100;

    // tags
    var DIV_TAG               = '<div></div>';
    var LI_TAG                = '<li></li>';
    var UL_TAG                = '<ul></ul>';
    var BUTTON_TAG            = '<button></button>';

    // classes
    var YEARCLASS             = 'year-num';
    var MONTHCLASS            = 'month-num';
    var TITLECLASS            = 'title';
    var BODYCLASS             = 'body';
    var WEEKCLASS             = 'week';
    var DAYCLASS              = 'day-num';
    var DATECLASS             = 'date';
    var AGENDACLASS           = 'agenda';
    var TASKCLASS             = 'task';
    var HOSTCLASS             = 'host';
    var LOCATIONCLASS         = 'location';
    var DESCRIPTIONCLASS      = 'description';
    var DETAILDATECLASS       = 'detail-date';
    var HIDDENCLASS           = 'hidden';
    var DISPLAYEVENTSCLASS    = 'display-events';
    var NEWTASKCLASS          = 'new-task';
    var NEWTASKDETAILSCLASS   = 'new-task-details';
    var DATEINPUTCLASS        = 'date-input';
    var HOSTINPUTCLASS        = 'host-input';
    var LOCATIONINPUTCLASS    = 'location-input';
    var DESCRIPTIONINPUTCLASS = 'description-input';
    var ERRORCLASS            = 'error';
    var DELETECLASS           = 'delete';
    var SUBMITTASKCLASS       = 'submit-task';
    var TOPLEFTBORDERCLASS    = 'top-left-border';
    var BOTTOMBORDERCLASS     = 'bottom-border';
    var RIGHTBORDERCLASS      = 'right-border';
    var LEFTMONTHCLASS        = 'month-left';
    var TODAYBUTTONCLASS      = 'today-button';
    var RIGHTMONTHCLASS       = 'month-right';

    // ids
    var TODAYID               = 'today';
    var DETAILID              = 'detail';

    // month information
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
        var titleElement = $(DIV_TAG).addClass(TITLECLASS)
                                     .text(MONTHS[_month].long + ' - ' + _year);
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
        var year = $(DIV_TAG).addClass(YEARCLASS + _year);
        for (var i = 1; i < 13; ++i) {
            year.append(createMonth(i, _year));
        }
        return year;
    }

    function createYearWithMonths (_year, _months) {
        var year = $(DIV_TAG).addClass(YEARCLASS + _year);
        for (var i = 0; i < _months.length; ++i) {
            year.append(_months[i]);
        }
        return year;
    }

    function createYearFromDate (_date) {
        return createYear(_date.getFullYear());
    }

    function _c (c) { return '.' + c; }
    function _i (i) { return '#' + i; }
    function classBeginsWith (_prefix) {
        return '[class^="' + _prefix + '"]';
    }

    function year (_date) {
        return _c(YEARCLASS) + (_date.getFullYear());
    }

    function month (_date) {
        return _c(MONTHCLASS) + (_date.getMonth() + 1);
    }

    function day (_date) {
        return _c(DAYCLASS) + (_date.getDate());
    }

    function yearMonth (_date) {
        return composeSelectors(year (_date),
                                month(_date));
    }

    function monthDay(_date) {
        return composeSelectors(month(_date),
                                day  (_date));
    }

    function yearMonthDay (_date) {
        return composeSelectors(year (_date),
                                month(_date),
                                day  (_date));
    }

    function composeSelectors () {
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
        _calendar.find(yearMonthDay(new Date()))
                 .attr('id', TODAYID);
    }

    function addEventsToCalendar(_events, _calendar) {
        $.each(_events, function (_index, _element) {
            var task        = $(LI_TAG)
                                .addClass(TASKCLASS);

            var detail_date = $(DIV_TAG)
                                .addClass(DETAILDATECLASS);
            var host        = $(DIV_TAG)
                                .addClass(HOSTCLASS)
                                .text(_element.Host);
            var location    = $(DIV_TAG)
                                .addClass(LOCATIONCLASS)
                                .text(_element.Location);
            var description = $(DIV_TAG)
                                .addClass(DESCRIPTIONCLASS)
                                .text(_element.Description);

            task.append(detail_date, host, location, description);

            var date = dateFromString(_element.Date);

            detail_date.text(date.toDateString());
            var agenda = _calendar
                            .find(yearMonthDay(date))
                            .find(_c(AGENDACLASS));
            agenda.append(task);
        });
    }

    function dateFromString (_string) {
        var rawDate = _string;
        if (rawDate.split(' ').length < 3) {
            rawDate += ' ' + current_date.getFullYear();
        }
        return new Date(rawDate);
    }

    // Detail modification
    function displayEventDetail () {
        var self = $(this);
        displayEvents.html(self.find(_c(AGENDACLASS)).clone());

        displayEvents.find(_c(TASKCLASS))
                     .append($(BUTTON_TAG).addClass(DELETECLASS)
                                          .text('DELETE'));

        editTaskDetails.fadeOut(animationTimeStep, function () {
            newTaskButton.fadeIn(animationTimeStep);
            displayEvents.fadeIn(animationTimeStep);
        });
    }
    function hideEventDetail () {
        displayEvents.empty();
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
        calendar.find(classBeginsWith(MONTHCLASS)).fadeOut(0);
        var current_month = calendar.find(yearMonth(current_date));
        if (current_month.length < 1) {
            initializeCalendar();
            current_month = calendar.find(yearMonth(current_date));
        }
        current_month.fadeIn(animationTimeStep);
    }

    function initializeCalendar () {
        editTaskDetails.hide();

        var year = createYear(current_date.getFullYear());
        year.find(classBeginsWith(MONTHCLASS)).hide();
        calendar.html(year);

        highlightTodayWithin(calendar);
        addEventsToCalendar(events, calendar);
        hideEventDetail();

        animateCalendar();
    }

    // New Task Entry and Modification
    function beginEditingNewTask (event) {
        // clear input fields
        inputDetailDate.val('');
        inputHost.val('');
        inputLocation.val('');
        inputDescription.val('');

        errorDetailDate.hide();
        errorHost.hide();
        errorLocation.hide();

        openTaskIndex = -1;

        displayEvents.fadeOut(animationTimeStep);
        newTaskButton.fadeOut(animationTimeStep, function () {
            editTaskDetails.fadeIn(animationTimeStep);
        });
    }

    function editExistingTask (event) {
        var $this = $(this);

        var current_detail_date_text = $this.find(_c(DETAILDATECLASS)).text();
        var current_host_text        = $this.find(_c(HOSTCLASS)).text();
        var current_location_text    = $this.find(_c(LOCATIONCLASS)).text();
        var current_description_text = $this.find(_c(DESCRIPTIONCLASS)).text();

        inputDetailDate.val(current_detail_date_text);
        inputHost.val(current_host_text);
        inputLocation.val(current_location_text);
        inputDescription.val(current_description_text);

        errorDetailDate.hide();
        errorHost.hide();
        errorLocation.hide();

        var existing_date = dateFromString(current_detail_date_text);
        var test_date;
        openTaskIndex = findExistingTask(current_detail_date_text,
                                         current_host_text,
                                         current_location_text,
                                         current_description_text);

        displayEvents.fadeOut(animationTimeStep);
        newTaskButton.fadeOut(animationTimeStep, function () {
            editTaskDetails.fadeIn(animationTimeStep);
        });
    }

    function findExistingTask (_date, _host, _location, _description) {
        var existing_date = dateFromString(_date);
        var test_date;
        for (var i = 0; i < events.length; ++i) {
            var element = events[i];
            test_date = dateFromString(element.Date);
            if (existing_date.toDateString() == test_date.toDateString() &&
                _host == element.Host &&
                _location == element.Location &&
                _description == element.Description) {
                return i;
            }
        }
        return -1;
    }

    function trim (_string) {
        return _string.replace(/^\s+|\s+$/g, '');
    }

    function submitTask (event) {
        var date_text     = trim(inputDetailDate.val());
        var host_text     = trim(inputHost.val());
        var location_text = trim(inputLocation.val());
        var descript_text = trim(inputDescription.val());

        var error = false;

        // check date
        var date_object = new Date(date_text);
        if (date_object.toString() === 'Invalid Date' || isNaN(date_object)) {
            errorDetailDate.show();
            error = true;
        } else {
            errorDetailDate.hide();
        }
        // check host
        if (host_text.length === 0) {
            errorHost.show();
            error = true;
        } else {
            errorHost.hide();
        }
        // check location
        if (location_text.length === 0) {
            errorLocation.show();
            error = true;
        } else {
            errorLocation.hide();
        }

        // success
        if (!error) {
            // new event
            if (openTaskIndex === -1) {
                events.push({
                    "Date" : date_text,
                    "Host" : host_text,
                    "Location" : location_text,
                    "Description" : descript_text
                });

                refreshEvents(events, calendar);
            } else {
                events.splice(openTaskIndex, 1);

                events.push({
                    "Date" : date_text,
                    "Host" : host_text,
                    "Location" : location_text,
                    "Description" : descript_text
                });

                refreshEvents(events, calendar);
            }

            editTaskDetails.fadeOut(animationTimeStep, function() {
                displayEvents.fadeIn(animationTimeStep);
                newTaskButton.fadeIn(animationTimeStep);
            });
        }
    }

    function removeTask (_index) {
        events.splice(_index, 1);
        refreshEvents(events, calendar);
    }

    function removeThisTask (event) {
        event.stopPropagation();

        var $this = $(this);

        var current_detail_date_text = $this.siblings(_c(DETAILDATECLASS)).text();
        var current_host_text        = $this.siblings(_c(HOSTCLASS)).text();
        var current_location_text    = $this.siblings(_c(LOCATIONCLASS)).text();
        var current_description_text = $this.siblings(_c(DESCRIPTIONCLASS)).text();

        var indexToRemove = findExistingTask(current_detail_date_text,
                                             current_host_text,
                                             current_location_text,
                                             current_description_text);
        if (indexToRemove !== -1) {
            removeTask(indexToRemove);
        }
    }

    function refreshEvents (_events, _calendar) {
        calendar.find(_c(AGENDACLASS)).empty();
        addEventsToCalendar(_events, _calendar);
        hideEventDetail();
    }

    function bindObjects (argument) {
        calendar         = $(_i('mainCalendar'));
        detail           = $(_i(DETAILID));
        displayEvents    = $(_c(DISPLAYEVENTSCLASS));
        leftButton       = $(_c(LEFTMONTHCLASS));
        todayButton      = $(_c(TODAYBUTTONCLASS));
        rightButton      = $(_c(RIGHTMONTHCLASS));
        newTaskButton    = $(_c(NEWTASKCLASS));
        editTaskDetails  = $(_c(NEWTASKDETAILSCLASS));
        inputDetailDate  = editTaskDetails.find(_c(DATEINPUTCLASS));
        inputHost        = editTaskDetails.find(_c(HOSTINPUTCLASS));
        inputLocation    = editTaskDetails.find(_c(LOCATIONINPUTCLASS));
        inputDescription = editTaskDetails.find(_c(DESCRIPTIONINPUTCLASS));
        errorDetailDate  = inputDetailDate.siblings(_c(ERRORCLASS));
        errorHost        = inputHost.siblings(_c(ERRORCLASS));
        errorLocation    = inputLocation.siblings(_c(ERRORCLASS));
        submitTaskButton = $(_c(SUBMITTASKCLASS));
    }

    function wireEvents (argument) {
        calendar.on('click', classBeginsWith(DAYCLASS), displayEventDetail);
        leftButton.on('click', goPreviousMonth);
        todayButton.on('click', goToday);
        rightButton.on('click',   goNextMonth);
        newTaskButton.on('click', beginEditingNewTask);
        submitTaskButton.on('click', submitTask);
        detail.on('click', _c(TASKCLASS), editExistingTask);
        detail.on(
            'click',
            _c(DELETECLASS),
            removeThisTask);
    }

    $(function () {
        current_date  = new Date();

        bindObjects();
        wireEvents();
        initializeCalendar();
    });
})(jQuery);
