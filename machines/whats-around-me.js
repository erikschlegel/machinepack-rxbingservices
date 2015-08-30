var Rx = require('rx');
var RxDOM = require('rx-dom');

var serviceUrl = 'https://spatial.virtualearth.net/REST/v1/data/f22876ec257b474b82fe2ffcb8393150';
var bingDSDefault = 'NAVTEQNA';
var bingPOIDefault = 'NavteqPOIs';

module.exports = {
  friendlyName: 'Whats Around Me',
  description: 'Bing Spatial Data Service: collects all entities around a specified geo location',
  extendedDescription: 'This calls bing spatial data service as an observable, and uses Rx to subscribe to the response of nearby entities',
  cacheable: false,
  sync: false,
  idempotent: false,
  inputs: {
    apiKey: {
        example: '232edfdnfddf4450',
        description: 'Your api access key to access bing spatial data services. This can be obtained at https://msdn.microsoft.com/en-us/library/ff428642.aspx',
        required: true
    },
    location: {
        example: '34.23245532,-40.47464. {latitude},{longitude}',
        description: 'The users latitude and longitude',
        required: true
    },
    select: {
        example: 'Latitude,Longitude,IsWiFiHotSpot,DisplayName',
        description: 'The selection fields from the bing spatial data source',
        required: false
    },
    datasourceName: {
        example: 'NAVTEQNA',
        description: 'The Bing spatial data public data source name to query',
        required: false
    },
    poiName: {
        example: 'NavteqPOIs',
        description: 'The point of interest name',
        required: false
    },
    filter: {
        example: 'StartsWith(PrimaryCity, Clear) eq true',
        description: 'The Odata filter for the bing spatial data query',
        required: false
    },
    orberByClause: {
        example: 'IsWheelchairAccessible',
        description: 'The Odata filter for the bing spatial data query',
        required: false
    },
    top: {
        example: '3',
        description: 'Sets the max returned alllwable results',
        required: false
    },
    radius: {
        example: '1',
        description: 'Spatial data filter radius(in kilometers)',
        required: true
    }
  },


  exits: {
    success: {
      variableName: 'result',
      description: 'Done.',
    },
    error: { 
      description: 'Unexpected error occurred.' 
    }
  },

  fn: function (input,exits)
  /*The main function which Creates an observable Http request 
     out to Bing*/{
      var validate = function(){
           return(input.location.split(',').length == 2);
      }

      if(!validate(input))
        return exits.error({description: 'request failed validation check'});

      var coords = input.location.split(',');

      var spatialFilter = "spatialFilter=nearby('{0}','{1}', {2});".format(coords[0], coords[1], input.radius); 
      var select = "$select={0};".format(input.select || '*');
      var filter = "$filter={0};".format(input.filter || '');
      var order = "$orderby={0};".format(input.order || '__Distance');
      var top = "$top={0};".format(input.top || 5);

      var BingURL = "{0}/{1}/{2}?key={3}&{4}&{5}&{6}&{7}&{8}&$format=json;".format(serviceUrl, 
                                              input.datasourceName || bingDSDefault,
                                              input.poiName || bingPOIDefault,
                                              input.apiKey, spatialFilter, select, top, filter,
                                              order);

      RxDOM.jsonpRequest(BingURL)
      .subscribe(
        function (response) {
          var bingResponse = {};

          response.forEach(function (item) {
            console.log(item);
          });

          return exits.success();
        },
        function (error) {
          // Log the error
        }
      );
    
  },
};

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};
