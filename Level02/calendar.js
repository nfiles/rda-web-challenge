(function($) {
	var DIV_TAG            = '<div></div>';
	var LI_TAG             = '<li></li>';
	var UL_TAG             = '<ul></ul>';
	var YEARCLASS          = 'year';
	var MONTHCLASS         = 'month';
	var TITLECLASS         = 'title';
	var BODYCLASS          = 'body';
	var WEEKCLASS          = 'week';
	var DAYCLASS           = 'day';
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

	function createDay (_date, _month, _todo) {
		var self = this;

		var dayElement = $(DIV_TAG).addClass(DAYCLASS+_date);

		if (typeof _date !== 'undefined' && _date !== null) {
			if (_date > 0 && _date <= MONTHS[_month].days) {
				var dateElement = $(DIV_TAG).addClass(DATECLASS).text(_date);
				var agendaElement = $(UL_TAG).addClass(AGENDACLASS);

				if (typeof _todo !== 'undefined' && todo !== null) {
					for (var i = 0; i < _todo.length; ++i) {
						var task = $(LI_TAG).addClass(TASKCLASS);
						task.text(_todo[i]);
						agendaElement.append(task);
					}
				}

				dayElement.append(dateElement).append(agendaElement);
			} else {
				dayElement.addClass(HIDDENCLASS);
			}
		}

		return dayElement;
	}

	function createDays(_start, _month) {
		var self = this;

		var days = [];
		for (var i = _start; i < start + 7; ++i) {
			days.push(createDay(i, _month));
		}

		return days;
	}

	function createWeek(_days) {
		var self = this;

		var weekElement = $(DIV_TAG).addClass(WEEKCLASS);
		for (var i = 0; i < _days.length; ++i) {
			weekElement.append(_days[i]);
		}

		return weekElement;
	}

	function createMonthFromWeeks(_month, _weeks) {
		var self = this;

		var monthElement = $(DIV_TAG).addClass(MONTHCLASS+_month);
		var titleElement = $(DIV_TAG).addClass(TITLECLASS).text(MONTHS[_month].long);
		var monthBodyElement = $(DIV_TAG).addClass(BODYCLASS);

		monthElement.append(titleElement, monthBodyElement);
		for (var i = 0; i < _weeks.length; ++i) {
			monthBodyElement.append(_weeks[i]);
		}

		return monthElement;
	}

	function createMonth(_month, _year, _firstday) {
		var self = this;

		if (typeof _month === 'undefined' || _month === null) {
			_month = new Date().getMonth() + 1;
		}

		if (typeof _year === 'undefined' || _year === null) {
			_year = new Date().getFullYear();
		}

		if (typeof _firstday === 'undefined' || _firstday === null) {
			_firstday = new Date(_year + '/' + _month + '/' + '1').getDay();
		}

		var monthElement = $(DIV_TAG).addClass(MONTHCLASS+_month);
		var titleElement = $(DIV_TAG).addClass(TITLECLASS).text(MONTHS[_month].long);
		var monthBodyElement = $(DIV_TAG).addClass(BODYCLASS);

		monthElement.append(titleElement, monthBodyElement);
		var numDays = MONTHS[_month].days;

		// alert(numDays);
		for (var i = 1 - _firstday; i <= numDays; i += 7) {
			var days = [];
			for (var j = 0; j < 7; ++j) {
				days.push(createDay(i + j, _month));
			}
			monthBodyElement.append(createWeek(days));
		}

		return monthElement;
	}

	function yearSelector (_date) {
		return '.' + YEARCLASS + (_date.getFullYear());
	}

	function monthSelector(_date) {
		return '.' + MONTHCLASS + (_date.getMonth() + 1);
	}

	function daySelector (_date) {
		return '.' + DAYCLASS + (_date.getDate());
	}

	function monthDaySelector(_date) {
		return monthSelector(_date) + ' ' + daySelector(_date);
	}

	function highlightTodayWithin(_calendar) {
		_calendar.find(monthDaySelector(new Date())).attr('id', TODAYID);
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

			var agenda = _calendar
							.find(monthDaySelector(new Date(_element.Date)))
							.find('.' + AGENDACLASS);
			agenda.append(task);
			// agenda.text("hello, world!");
		});
	}

	var displayEvents = function () {
		var self = $(this);
		var detail = $('#' + DETAILCLASS);
		detail.html(self.find('.' + AGENDACLASS).clone());
	};

	$(function () {
		var calendar = $('#mainCalendar');
		var month = createMonth(6);

		calendar.append(month);
		highlightTodayWithin(calendar);

		addEventsToCalendar(events, calendar);
		$("body").on("click", "[class^='day']", displayEvents);
	});
})(jQuery);
