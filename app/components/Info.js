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
    .then(res=>this.setState({channels: res}))
  }
  render(){
    
    if (!this.state.channels.length) return null;
    
    return (
      <div id="info" className={this.props.visible? '': 'hidden'}>
        <p>Search is based only on spoken content of videos. This is stored in captions, either by youtuber him/herself,
          the community or by YouTube's automatic speech recognition.
          In case of speech recognition it is likely that technical terms or other unusual words will be misunderstood for others.
          Only english language of captions is supported.
        </p>
        <p>Please tweet <span className="underscore_gray" >@okram_ovic</span> in case something is not as it should be.</p>
        <p>Out of supported channels, following videos unfortunately don't contain any captions.</p>
        { this.state.channels.map((chan,i)=>{
          return (
            <div>
              <h4 className="h_nocaps"> {chan.channel}</h4>
              { chan.names.map((title,i)=>{
                  const href = "https://youtu.be/" + chan.ids[i]
                  return <a key={i} href={href} target="_blank">{title}</a>
                })
              }
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
        console.log('empty list', res)
        resolve(res)
      }
    }
    xhr.send( JSON.stringify( {} ) );
  })
}