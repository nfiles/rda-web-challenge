(function() {
    'use strict';

    var controller = teamApp.controller('teamBuilderCtrl',
        function indexController($scope, teamData) {
            // name of team
            $scope.teamName = "";
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
            // JSON representation of team
            $scope.teamJSON = "";

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
            };

            $scope.moveItemsTop = function(all, highlighted) {
                var i,
                    item,
                    whereFrom;
                for (i = highlighted.length - 1; i >= 0; --i) {
                    item = highlighted[i];
                    whereFrom = all.indexOf(item);
                    if (whereFrom > 0) {
                        moveItemInArray(whereFrom, 0, all);
                    }
                }
            };

            $scope.moveItemsUp = function(all, highlighted) {
                var i,
                    item,
                    whereFrom,
                    whereTo;
                // for each highlighted item
                for (i = 0; i < highlighted.length; ++i) {
                    item = highlighted[i];
                    // get index of highlighted item in overall list
                    whereFrom = all.indexOf(item);
                    // if index can move up
                    if (whereFrom > 0) {
                        whereTo = whereFrom - 1;
                        // if the destination is not a highlighted item
                        if (highlighted.indexOf(all[whereTo]) === -1) {
                            moveItemInArray(whereFrom, whereTo, all);
                        }
                    }
                }
            };

            $scope.moveItemsDown = function(all, highlighted) {
                var i,
                    item,
                    whereFrom,
                    whereTo;
                // for each highlighted item
                for (i = highlighted.length - 1; i >= 0; --i) {
                    item = highlighted[i];
                    // get index of highlighted item in overall list
                    whereFrom = all.indexOf(item);
                    // if index can move down
                    if (whereFrom + 1 < all.length) {
                        whereTo = whereFrom + 1;
                        // if the destination is not a highlighted item
                        if (highlighted.indexOf(all[whereTo]) === -1) {
                            moveItemInArray(whereFrom, whereTo, all);
                        }
                    }
                }
            };

            $scope.moveItemsBottom = function(all, highlighted) {
                var i,
                    item,
                    whereFrom;
                for (i = 0; i < highlighted.length; ++i) {
                    item = highlighted[i];
                    whereFrom = all.indexOf(item);
                    if (whereFrom + 1 < all.length) {
                        moveItemInArray(whereFrom, all.length, all);
                    }
                }
            };

            $scope.createTeam = function(name, players) {
                var team = {
                    name: name,
                    players: []
                };

                for (var i = 0; i < players.length; ++i) {
                    team.players.push(players[i].name);
                }

                console.log(team);
                // console.log(JSON.stringify(team, null, 2));
                $scope.teamJSON = JSON.stringify(team, null, 2);
            };
        });
	//#region internal methods
    function moveItemInArray(whereFrom, whereTo, array) {
        var item = array[whereFrom];
        array.splice(whereFrom, 1);
        array.splice(whereTo, 0, item);
    }
    //#endregion
})();
