const React = require('react');
const ChannelResult = require('./ChannelResults');

const UnorderedList = function({ channels, query }) {
  //console.log('UL props',this.props, query)
  return (
    <ul>
      {channels.sort((a,b)=>{
            // sort channels alphabetically
            const x = b.channel.toLowerCase() >= a.channel.toLowerCase()
            return x ? -1 : 1
        })
        .map(function(item, i) {
        return <ChannelResult key={i} itemData={item} channelIndex={i} query={query}/>
      })}
    </ul>
  );
}

module.exports = UnorderedList;