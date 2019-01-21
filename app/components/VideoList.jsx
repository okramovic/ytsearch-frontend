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

      
      return (
        this.props.expt.map((x,i)=>{
          return (
              <div key={i} className={this.props.shown}> 
                  <h2 className="channel_header">{x.title}</h2>
  
               
                {x.excerpts.map((e,i)=>{
                  return (<div>
                    <a href={'https://youtu.be/'+x.id+'?t='+e.time} target="_blank">{secondsToHumanTime(e.time)}</a>
                    <p className="excerpt_text">{e.text}</p>
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


function secondsToHumanTime(num){
    const sec = num % 60
    const mins = ((num - sec)/60)%60
    const hrs = Math.floor((num-sec)/3600)
    
    const secStr = sec<10? '0' + sec : sec,
    minStr = mins<10? '0' + mins : mins,
    hrsStr = hrs<10? '0' + hrs : hrs
    return (hrsStr=='00'?'': hrsStr + ':') + minStr + ':' + secStr
}