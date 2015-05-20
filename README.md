# aurelia-i18next-parser

Extracts i18n from html and js files.

Also tries to extract Aurelia specific values like the routes with a navigation.

## Installation

    npm install gooy/aurelia-i18next-parser
    
## Usage
    
    var gulp = require('gulp');
    var i18next = require('aurelia-i18next-parser');
    
    gulp.task('i18n', function() {
      gulp.src('src/**/*')
      .pipe(i18next({
         routesModuleId: "routes",          //module to extract routes from
         appPath: "src",                    //path to the aurelia application files relative from the gulpfile
         locales: ['en', 'de'],             //translation files will be created for these
         defaultLocale: 'en',               //this will be treated as the default locale, the extracted values will not be transformed for this locale
         translation_attribute:"i18n",      //attribute that is used in the html to specify translation keys
         functions:['t'],                   //function that is used in javascript to translate values
         defaultNamespace:'translation'
       }))
      .pipe(gulp.dest('src/locales'));
    });
    
