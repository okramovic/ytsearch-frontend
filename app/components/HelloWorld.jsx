const React = require('react');
const UnorderedList = require('./UnorderedList');

const dependenciesArray = [
  'express - middleware for the node server',
  'react - for generating the views of the app',
  'react-dom - powers the rendering of elements to the DOM, typically paired with React',
  'webpack - for bundling all the javascript',
  'webpack-cli - command line support for webpack',
  'jsx-loader - allows webpack to load jsx files'
];
const componentsMade = [
  'HelloWorld - which is the view you are seeing now!',
  'UnorderedList - which takes an array of "items" and returns a <ul> element with <li>, elements of each of those items within it',
];


/* the main page for the index route of this app */
class HelloWorld extends React.Component {
  constructor(props){
    super(props)
  }
  submitHandler
  render(){
  return (
    <div>

      <form>
        <input id="main" type="text" placeholder="search"/>
        <p>fulltext search in your favorite YT channels</p>
      </form>

      <h1 id="searchTermHeader">header</h1>
      
      <UnorderedList items={[]} />

      
      <div id='mycredit'>
        
      </div>
      
    </div>
  );
  } 
}
// <p>made with love in Vienna by me</p>

module.exports = HelloWorld;