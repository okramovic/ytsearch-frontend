const React = require('react');

class Info extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      channels: []
    }
    
  }
  componentDidMount(){
    getEmptyVideos()
    .then(res=>this.setState(prev=>{
      
      // store keys in state for toggling list visibility
      res.map(channelInfo=>{
        prev[channelInfo.channel] = false
      })
      
      return {channels: res}
    }))
  }
  render(){
    
    if (!this.state.channels.length) return null;
    
    return (
      <div id="info" className={this.props.visible? '': 'hidden'}>
        <p>Exact phrase of what you wrote is searched for. No further intelligence is involved so you get all results that are found.</p>
        <p>Search is based only on spoken content of videos. This is stored in captions, either by youtuber him/herself,
          the community or by YouTube's automatic speech recognition.
          In case of speech recognition it is likely that technical terms or other unusual words will be misunderstood for others.
          Only english language of captions is supported.
        </p>
        <p>Please tweet <span className="underscore_gray" >@okram_ovic</span> in case something is not as it should be. Guys, I'm sorry for the design...</p>
        <p>Out of supported channels, following videos unfortunately don't contain any captions.</p>
        { this.state.channels.map((chan,i)=>{
          return (
            <div>
              <h4 className="h_nocaps"> {chan.channel}</h4>
              <div className={ this.state[chan.channel]? '': 'hidden'}>
              { chan.empty_videos.map((infoObj,i)=>{
                  const href = "https://youtu.be/" + infoObj.id
                  return <a key={i} href={href} target="_blank">{infoObj.title} {infoObj.ok_count}/{infoObj.ok_count + infoObj.empty_count}</a>
                })
              }
              </div>
            </div>
          )
         })
        }
      </div>
    )
  }
}

module.exports = Info


function getEmptyVideos(){
  return new Promise((resolve, reject)=>{
  
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/nowords", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        const res = JSON.parse(xhr.responseText)
        resolve(res)
      }
    }
    xhr.send( JSON.stringify( {} ) );
  })
}