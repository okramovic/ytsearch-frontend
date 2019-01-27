const React = require('react');
const UnorderedList = require('./UnorderedList');
const VideoExc = require('./VideoExc');


class ChannelRes extends React.Component{
  constructor(props){
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
    this.state = {
      shown: true
    }
  }
  clickHandler(ev){
    this.setState((prevState)=>{
      return {shown: !prevState.shown}
    })
  }
  render(){
    if (!this.props.itemData.expt.length) return null;
    
    const item = this.props.itemData
    const iconUrl = getIconURL(item.channel)
    
    // channel
    //  |- video - exc
    //  |        - exc
    //  |- video - exc
    
    // sort them alphabetically
    item.expt = item.expt.sort((a,b)=>{
        const x = b.title.toLowerCase() > a.title.toLowerCase()
        return x ? -1 : 1
    })
    
    
    return (
      <li className={'channel_results ' + (this.state.shown ? 'margTB65':'margTB10')}
          style={{paddingBottom: this.state.shown? '16px': '0px'}}>
        <div className="channel_outer">
          <div className="channel_inner">
            <img src={iconUrl} className="channel_thumb"></img>
            <h3 >{item.channel}</h3>
          </div>
          <button className="collapse_button" onClick={this.clickHandler}>{this.state.shown? 'hide':'open'}</button>
        </div>
        <div className={this.state.shown ? '':'hidden'} chan={item.channel}>
          {item.expt.map((video,i)=>{
            
            return <VideoExc key={i} vid={video.id} videos={video.excerpts} title={video.title} query={this.props.query}/>      
          })}
        </div>
      </li>
    )
  }
} //  <VideoList videos={item.expt} />

module.exports = ChannelRes
    

function getIconURL(channel){
    const CT = 'https://yt3.ggpht.com/a-/AAuE7mC56ctnjTBFVmFaDttL3sC26U2CRiICqBgJ-g=s288-mo-c-c0xffffffff-rj-k-no'
    const Jeremy = 'https://yt3.ggpht.com/a-/AAuE7mBtvK6ioufwJFDGRT9WOvEykaDnAo0jGPOwvQ=s288-mo-c-c0xffffffff-rj-k-no'
    const Siraj = 'https://yt3.ggpht.com/a-/AAuE7mAfNzuo-vOC8wdETbqIPU4UbnknsxCbCj3lLg=s176-c-k-c0x00ffffff-no-rj-mo'
    const Twominute = 'https://yt3.ggpht.com/a-/AAuE7mBCBo51MwaRPnZWRH-BvZXhTCejRrbWhzYxuA=s48-mo-c-c0xffffffff-rj-k-no'
    const StatOfDOOM = 'https://yt3.ggpht.com/a-/AAuE7mCy4GqOAJM5NfMAFpzROugAVx-ySG5ZcIfkWQ=s176-c-k-c0x00ffffff-no-rj-mo'
    
    let iconUrl = ''

    if ( channel == 'Coding train') iconUrl = CT
    else if (channel.match(/^jeremy howard/i))  iconUrl = Jeremy
    else if (channel.match(/siraj raval/i))  iconUrl = Siraj
    else if (channel.match(/two minute papers/i))  iconUrl = Twominute
    else if (channel.match(/Statistics of DOOM/i))  iconUrl = StatOfDOOM
  
  
  return iconUrl
}