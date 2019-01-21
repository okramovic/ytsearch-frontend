const React = require('react');
const UnorderedList = require('./UnorderedList');
const VideoList = require('./videoexpt');


class ChannelRes extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    if (!item.expt.length) return null;
    return (
      this.props.expt.map()
    )
    
        
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
          <li className="channel_results">
            <div className="channel_outer">
              <div className="channel_inner">
                <img src={iconUrl} className="channel_thumb"></img>
                <h3 >{item.channel}</h3>
              </div>
              <button className="collapse_button" onClick={this.props.shown===undefined? 1:0}>hide</button>
            </div>
            <VideoList key={i} expt={item.expt} className={this.props.shown? '':'hidden'}/>
          </li>
          
        )
  }
}

module.exports = ChannelRes