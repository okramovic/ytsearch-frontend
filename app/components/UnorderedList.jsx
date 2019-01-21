const React = require('react');
const ChannelList = require('./videoexpt');


/* takes an array prop 'items' and returns a <ul> element 
   with each item as <li> elements */
const UnorderedList = function({ channels }) {
  return (
    <ul>
      {channels.map(function(item, i) {
        const CT = 'https://yt3.ggpht.com/a-/AAuE7mC56ctnjTBFVmFaDttL3sC26U2CRiICqBgJ-g=s288-mo-c-c0xffffffff-rj-k-no'
        const Jeremy = 'https://yt3.ggpht.com/a-/AAuE7mBtvK6ioufwJFDGRT9WOvEykaDnAo0jGPOwvQ=s288-mo-c-c0xffffffff-rj-k-no'
        const Siraj = 'https://yt3.ggpht.com/a-/AAuE7mAfNzuo-vOC8wdETbqIPU4UbnknsxCbCj3lLg=s176-c-k-c0x00ffffff-no-rj-mo'
        const Twominute = 'https://yt3.ggpht.com/a-/AAuE7mBCBo51MwaRPnZWRH-BvZXhTCejRrbWhzYxuA=s48-mo-c-c0xffffffff-rj-k-no'
        const channel = item.channel //this.props.channelname
        let iconUrl = ''

        if ( channel == 'Coding train') iconUrl = CT
        else if (channel.match(/fastai/))  iconUrl = Jeremy
        else if (channel.match(/siraj raval/i))  iconUrl = Siraj
        else if (channel.match(/two minute papers/i))  iconUrl = Twominute
        
        
        console.log(item.channel, item.expt)
        return (
          <li className="channel_outer">
            <div className="channel_inner">
              <img src={channel} className="channel_thumb"></img>
              <h3 >{item.channel}</h3>
            </div>
            <ChannelList key={i} expt={item.expt} />
          </li>
          
        )
        
        //return <li key={i}>{item}</li>;
      })}
    </ul>
  );
}

module.exports = UnorderedList;