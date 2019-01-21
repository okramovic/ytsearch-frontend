const React = require('react');
const ChannelList = require('./videoexpt');


/* takes an array prop 'items' and returns a <ul> element 
   with each item as <li> elements */
const UnorderedList = function({ channels }) {
  return (
    <ul>
      {channels.map(function(item, i) {
        console.log(item.channel, item.expt)
        return (
          <div>
            <h3>{item.channel}</h3>
            <ChannelList key={i} expt={item.expt} />
          </div>
          
        )
        
        //return <li key={i}>{item}</li>;
      })}
    </ul>
  );
}

module.exports = UnorderedList;