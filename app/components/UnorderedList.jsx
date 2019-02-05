const React = require('react');
const ChannelResult = require('./ChannelResults');

const UnorderedList = function({ channels, query }) {
  //console.log('UL props',this.props, query)
  return (
    <ul>
      {channels.map(function(item, i) {
        return <ChannelResult key={i} itemData={item} channelIndex={i} query={query}/>
      })}
    </ul>
  );
}

module.exports = UnorderedList;