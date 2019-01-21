const React = require('react');

class VideoList extends React.Component{
  constructor(props){
    super(props)
    
    this.clickHandler = this.clickHandler.bind(this)
    //this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
      show: true
    }
  }
  clickHandler(ev){
    this.setState((prev)=>{
        //return {shown: !prevState.shown}
        return {show: !prev.show }
       })
  }
  render(){

      
      return (
        this.props.videos.map((x,i)=>{
          return (
              <div key={i} className={this.state.show ? 'ooo':'lll'}> 
                  <h2 className="channel_header" onClick={this.clickHandler}>{x.title}</h2>
  
               
                {x.excerpts.map((e,i)=>{
                  return (<div className="singleExcerpt">
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