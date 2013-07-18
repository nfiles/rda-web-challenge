(function(){'use strict';})();

var controller = teamApp.controller('indexController',
	function indexController ($scope, teamData) {
		// players that can be chosen
		$scope.availablePlayers = {
			all: teamData.players,
			highlighted: []
		};
		// players that have been highlighted
		$scope.chosenPlayers = {
			all: [],
			highlighted: []
		};

		$scope.moveItemsToList = function(sourceAll, sourceHighlighted, destinationAll) {
			var i = 0;
			var where = 0;
			for (i = 0; i < sourceHighlighted.length; ++i) {
				where = sourceAll.indexOf(sourceHighlighted[i]);
				if (where >= 0) {
					// add highlighted items to destination
					destinationAll.push(sourceHighlighted[i]);
					// remove all highlighted items from source
					sourceAll.splice(where, 1);
				}
			}

			// clear highlighted items
			// sourceHighlighted = [];
			// don't think this does anything :\
		};

		// Working
		$scope.moveItemsTop = function(all, highlighted) {
			var i,
				item,
				where;
			for (i = highlighted.length - 1; i >= 0; --i) {
				item = highlighted[i];
				where = all.indexOf(item);
				if (where > 0) {
					all.splice(where, 1);
					all.splice(0, 0, item);
				}
			}
		};

		// Not Working
		$scope.moveItemsUp = function(all, highlighted) {
			var i,
				item,
				where;
			for (i = 0; i < highlighted.length; ++i) {
				item = highlighted[i];
				where = all.indexOf(item);
				if (where > 0) {
					all.splice(where, 1);
					all.splice(where - 1, 0, item);
				}
			}
		};

		// Not Working
		$scope.moveItemsDown = function(all, highlighted) {
			var i,
				item,
				where;
			// for (i = 0; i < highlighted.length; ++i) {
			for (i = highlighted.length - 1; i >= 0; --i) {
				item = highlighted[i];
				where = all.indexOf(item);
				if (where + 1 < all.length) {
					all.splice(where, 1);
					all.splice(where + 1, 0, item);
				}
			}
		};

		// Working
		$scope.moveItemsBottom = function(all, highlighted) {
			var i,
				item,
				where;
			for (i = 0; i < highlighted.length; ++i) {
				item = highlighted[i];
				where = all.indexOf(item);
				if (where + 1 < all.length) {
					all.splice(where, 1);
					all.splice(all.length, 0, item);
				}
			}
		};
	});
