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
        <p>Search is based on spoken content of videos. This is captured in captions, either by Youtuber him/herself
          or the community or by YouTube's speech recognition.
          In case of speech recognition it is likely that some unusual or technical terms will be misunderstood.
          Only english language of captions is supported.
        </p>
        Out of supported channels, these videos unfortunately don't contain any captions.
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