const React = require('react');
const ChannelList = require('./ChannelResults');


/* takes an array prop 'items' and returns a <ul> element 
   with each item as <li> elements */
const UnorderedList = function({ channels }) {
  return (
    <ul>
      {channels.map(function(item, i) {
        
        return <ChannelList key={i} itemData={item}/>
        
        //return <li key={i}>{item}</li>;
      })}
    </ul>
  );
}

module.exports = UnorderedList;