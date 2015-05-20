import System from "systemjs";

import "config";
import "babel/polyfill";
import "core-js";

import corejs from "core-js";
var Promise = corejs.Promise;

export class AppExtractor{

  /**
   * Configure systemjs to work with the local application
   */
  constructor(appPath){
    //prepare for use in windows
    System.config({
      "baseURL": "./",
      "transpiler": 'babel',
      "babelOptions": {
        "stage": 0
      },
      "paths":{
        "*": appPath+"/*.js"
      }
    });
  }

  /**
   * Gets the routes from a module.
   * The module should export the routes array as a variable.
   *
   * @param moduleId    id of the module to load.
   * @returns {Promise}
   */
  getNavFromRoutes(moduleId){
    if(!moduleId) Promise.resolve(null);
    //get routes from the aurelia application
    return System.import(moduleId).then(m=>{
      var navRoutes = [];
      for(var i = 0, l = m.routes.length; i < l; i++){
        var route = m.routes[i];
        if(route.nav) navRoutes.push(route);
      }
      return navRoutes;
    });
  }
}
