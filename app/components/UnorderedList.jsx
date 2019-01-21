const React = require('react');
const ChannelList = require('./ChannelResults');

const UnorderedList = function({ channels, query }) {
  console.log('UL props',this.props, query)
  return (
    <ul>
      {channels.map(function(item, i) {
        return <ChannelList key={i} itemData={item} query={query}/>
      })}
    </ul>
  );
}

module.exports = UnorderedList;