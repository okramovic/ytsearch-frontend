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
              <li key={i} classname="">
                <div classname="channel_inner">
                  
                  <h2 classname="channel_header">{x.title}</h2>
                </div>
               
                {x.excerpts.map((e,i)=>{
                  return (<div>
                    <a href={x.id} target="_blank">{secondsToHumanTime(e.time)}</a>
                    <p classname="excerpt_text">{e.text}</p>
                  </div>)
                 })
                }
              </li>
                           
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