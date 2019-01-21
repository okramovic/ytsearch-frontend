const React = require('react');
const ChannelList = require('./ChannelResults');

const UnorderedList = function({ channels }) {
  return (
    <ul>
      {channels.map(function(item, i) {
        return <ChannelList key={i} itemData={item} query={this.props.query}/>
      })}
    </ul>
  );
}

module.exports = UnorderedList;