const React = require('react');

class VideoList extends React.Component{
  constructor(props){
    super(props)
    
    //this.submitHandler = this.submitHandler.bind(this)
    //this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
    }
  }
  render(){
    const CT = 'https://yt3.ggpht.com/a-/AAuE7mC56ctnjTBFVmFaDttL3sC26U2CRiICqBgJ-g=s288-mo-c-c0xffffffff-rj-k-no'
    const Jeremy = 'https://yt3.ggpht.com/a-/AAuE7mBtvK6ioufwJFDGRT9WOvEykaDnAo0jGPOwvQ=s288-mo-c-c0xffffffff-rj-k-no'
    const Siraj = 'https://yt3.ggpht.com/a-/AAuE7mAfNzuo-vOC8wdETbqIPU4UbnknsxCbCj3lLg=s176-c-k-c0x00ffffff-no-rj-mo'
    const Twominute = 'https://yt3.ggpht.com/a-/AAuE7mBCBo51MwaRPnZWRH-BvZXhTCejRrbWhzYxuA=s48-mo-c-c0xffffffff-rj-k-no'
    
    const channel = this.props.channelname
    let iconUrl = ''
    
    if ( channel == 'Coding train') iconUrl = CT
    else if (channel.match(/fastai/))  iconUrl = Jeremy
    else if (channel.match(/siraj raval/i))  iconUrl = Siraj
    else if (channel.match(/two minute papers/i))  iconUrl = Twominute
      
      return (
        this.props.expt.map((x,i)=>{
          return (
              <div key={i}>
                <div classname="channel_inner">
                  <img src={channel} classname="channel_thumb"></img>
                  <h2 classname="channel_header">{x.title}</h2>
                </div>
               
                {x.excerpts.map((e,i)=>{
                  return (<div>
                    <a href={x.id} target="_blank"></a>
                    {e.text}
                  </div>)
                 })
                }
              </div>
                           
          )
      })
      )
      
    
  }
}

module.exports = VideoList;