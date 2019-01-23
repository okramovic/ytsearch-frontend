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
        Out of supported channels, these videos unfortunately dont contain any caps
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