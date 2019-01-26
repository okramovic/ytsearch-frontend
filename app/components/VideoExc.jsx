const React = require('react');

class VideoList extends React.Component{
  constructor(props){
    super(props)
    
    this.clickHandler = this.clickHandler.bind(this)
    //this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
      show: false
    }
  }
  clickHandler(ev){
    this.setState((prev)=>{
        //return {shown: !prevState.shown}
        return {show: !prev.show }
       })
  }
  render(){
      const vid = this.props.vid
      
      // className={this.state.show ? '':'hidden'}  style={padingBottom}
      return (
              <div > 
                  <h2 className={ "channel_header " + (this.state.show? '':'title_collapsed') }
                    videoname={this.props.title} onClick={this.clickHandler}>{this.props.title}</h2>
                <span style={{display: this.state.show? 'block':'none'}}>click on time to watch excerpt</span>
                {this.props.videos.map((e,i)=>{
                  if (!this.state.show) return null;
                
                  return (<div className="singleExcerpt">
                    <a href={'https://youtu.be/'+ vid +'?t='+e.time} 
                       target="_blank">{secondsToHumanTime(e.time)}</a>
                    <p className="excerpt_text">{
                        e.text
                        // highlight words from query
                        /*e.text.split(' ').map(w=>{
                          if (!w) return w;
                          const rr = new RegExp('^'+w+'$','')
                          //console.log(rr)
                          if (this.props.query.match(rr)) 
                            return <span className="highlighted">{w}</span>
                          
                          return w + ' '
                        })*/ //this returs [object object]: .join(' ')
                        
                    }</p>
                  </div>)
                 })
                }
              </div>
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