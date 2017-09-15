(function ($, ns, module, ds) {
  var blackoutTeams = false,
      gameBlackoutStatus = {},
      // @TODO: Use FeedsServices.php to provide mini boxscore url.
      dataBaseUrl = [
        ds.hasOwnProperty('SDATA_URL_BASE') ? ds.SDATA_URL_BASE : '//data.nba.net',
        '/10s/',
        ds.hasOwnProperty('SDATA_URL_PATH') ? ds.SDATA_URL_PATH : 'prod',
        '/v1/'
      ].join('');

  module[ns] = {
    getBlackoutStatus: getBlackoutStatus,
    getBlackoutTeams: getBlackoutTeams
  };

  function getBlackoutStatus(gameID, date, cb) {
    if (blackoutTeams === false) {
      stepOne();
    }
    else if (!gameBlackoutStatus.hasOwnProperty(gameID)) {
      stepTwo();
    }
    else {
      done();
    }

    function stepOne() {
      getBlackoutTeams(stepTwo);
    }
    function stepTwo() {
      checkBlackoutStatus(gameID, date, done);
    }
    function done() {
      cb(gameBlackoutStatus[gameID]);
    }
  };

  function getBlackoutTeams(cb) {
    var geoUrl = ds.hasOwnProperty('GEO_URL') ? ds.GEO_URL : '//geo.nba.com/api/geo';
    // Create array of regional blackout teams by ip address.
    $.getJSON(geoUrl + "/ip")
      .done(function(blackoutTeamData) {
        // returns "n" if there are no blackout teams for this region.
        if (blackoutTeamData.location.reg !== "n") {
          blackoutTeams = blackoutTeamData.location.reg.split("_");
        } else {
          blackoutTeams = [];
        }
        cb(blackoutTeams);
      });
  }

  function checkBlackoutStatus(gameID, date, cb) {
    // @TODO: Use FeedsServices.php to provide mini boxscore url.
    $.getJSON(dataBaseUrl + date + '/' + gameID + '_mini_boxscore.json')
      .done(function(data) {
        var i = blackoutTeams.length,
            blackoutString = data.basicGameData.watch.broadcast.video.regionalBlackoutCodes;
        gameBlackoutStatus[gameID] = false;
        while (i--) {
          if (blackoutString.indexOf(blackoutTeams[i].toLowerCase()) > -1) {
            gameBlackoutStatus[gameID] = true;
            break;
          }
        }
        cb(gameBlackoutStatus[gameID]);
      });
  }
})(jQuery, "blackout", window._nba = window._nba || {}, window.drupalSettings);
