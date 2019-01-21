const React = require('react');


/* takes an array prop 'items' and returns a <ul> element 
   with each item as <li> elements */
const UnorderedList = function({ channels }) {
  return (
    <ul>
      {channels.map(function(item, i) {
        console.log(item.channels)
        return <li key={i}>haha</li>;
        
        //return <li key={i}>{item}</li>;
      })}
    </ul>
  );
}

module.exports = UnorderedList;