// // http://stackoverflow.com/questions/30773756/is-it-okay-to-use-babel-node-in-production
// require('babel-core/register');  // debugger is breaked..
const app = require('./src/app');

app.listen(3000);