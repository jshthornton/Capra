var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

for (var file in window.__karma__.files) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
}

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'text': 'lib/text',
    'ring': 'lib/ring',
    'backbone': 'lib/backbone',
    'underscore': 'lib/underscore',
    'jquery': 'lib/jquery',
    'nodeNab': 'lib/node-nab',
    'jquery-ui': 'lib/jquery-ui',
    'capra': 'src'
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
