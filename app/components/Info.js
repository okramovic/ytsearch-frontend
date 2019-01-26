const React = require('react');

class Info extends React.Component{
  constructor(props){
    super(props)
    this.toggleHandler = this.toggleHandler.bind(this)
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
  toggleHandler(name){
    // toggle visibility of empty video list
    this.setState(prev=>{
      const val = !prev[name]
      return { [name]:val}
    })
  }
  render(){
    
    if (!this.state.channels.length) return null;
    
    return (
      <div id="info" className={this.props.visible? '': 'hidden'}>
        <p>Exact phrase of what you wrote is searched for. No further intelligence is involved so you get all results that are found. Ordering of videos in each channel is alphabetical.</p>
        <p>Search is based only on spoken content of videos. This is stored in captions that are made either by youtuber him/herself,
          the community or by YouTube's automatic speech recognition.
          In case of speech recognition it is likely that technical terms or other uncommon words will be misunderstood for others.
          Only english language of captions is supported.
        </p>
        <p>Please tweet <span className="underscore_gray" >@okram_ovic</span> in case something is not as it should be. Guys, I'm sorry for the design. I am currently not able to come up with anything better.</p>
        <p>Out of supported channels, following videos unfortunately don't contain any or enough captions. Numbers behind each video title show: words present / total words estimated.</p>
        { this.state.channels.map((chan,i)=>{
          if (!chan.empty_videos.length) return null;
          return (
            <div>
              <div className="flex clickable_header" onClick={()=>this.toggleHandler(chan.channel) }>
                <h4 className="h_nocaps"> {chan.channel} ({chan.empty_videos.length})</h4>
                <span className="pad_lr_15 noselect collapse_button">{ this.state[chan.channel]?'hide':'expand'}</span>
              </div>
              <div className={ this.state[chan.channel] ? 'flex col': 'hidden'}>
              { chan.empty_videos.sort((a,b)=>{
                  if (/^ ?live stream #(\d+)/i.test(a.title) && /^ ?live stream #(\d+)/i.test(b.title)){
                    let numA = a.title.match(/^ ?live stream #(\d+)/i),
                        numB = b.title.match(/^ ?live stream #(\d+)/i)
                        numA = numA[1]
                        numB = numB[1]
                    
                    return numA-numB
                  }
                  const x = b.title.toLowerCase() >= a.title.toLowerCase()
                  return x ? -1 : 1
                })
                .map((infoObj,i)=>{
                  const href = "https://youtu.be/" + infoObj.id
                  return <a key={i} href={href} target="_blank">{infoObj.title} ({infoObj.ok_count}/{infoObj.ok_count + infoObj.empty_count})</a>
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