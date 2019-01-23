const React = require('react');

class Info extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      channels: getEmptyVideos()
    }
    
  }
  render(){
    return (
      <div id="info" className={this.props.visible? '': 'hidden'}>
        These videos unfortunately dont contain any caps
        {this.state.channels.map((chan,i)=>{
          return (
            <div>
              <h4 > {chan.channel}</h4>
              chan.names.map((name,i)=>{})
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