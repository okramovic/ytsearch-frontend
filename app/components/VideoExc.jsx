const React = require('react');

class VideoList extends React.Component{
  constructor(props){
    super(props)
    
    this.clickHandler = this.clickHandler.bind(this)
    //this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
      show: this.props.channelIndex === 1? true : false,
      span_color: 'black'
    }
    console.log(this.state, this.props)
  }
  clickHandler(ev){
    this.setState((prev)=>//{
        //return 
                  ({show: !prev.show })
       // }
    )
    const self = this
    setTimeout(()=>{ 
        self.setState((prev)=>{  
          return { span_color: 'white'}
          // prev.span_color == 'black'? 'white' : 'white'
        })
    },5000)
  }
  render(){
      const vid = this.props.vid
      
      // className={this.state.show ? '':'hidden'}  style={padingBottom}
      return (
              <div > 
                  <h2 className={ "channel_header " + (this.state.show? '':'title_collapsed') }
                    videoname={this.props.title} onClick={this.clickHandler}>{this.props.title}</h2>
                <span className={this.state.span_color == 'white'? 'white':'black'} style={{
                    display: this.state.show? 'block':'none',
                    fontSize: '12px'
                }}>click on time to watch excerpt</span>
                <span className="videoresult_date" 
                      style={{display: this.state.show? 'block':'none'}}
                  >Published {uploadedDateToHuman(this.props.uploaded)}</span>
                {this.props.videos.map((e,i)=>{
                  
                  if (!this.state.show) return null;
                  
                  return (<div className="singleExcerpt">
                    <a href={'https://youtu.be/'+ vid +'?t='+e.time} 
                       target="_blank">{secondsToHumanTime(e.time)}</a>
                    <p className="excerpt_text">{
                        getHighlightedText(e.text, this.props.query) 
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


function getHighlightedText(text, higlight) {
    // Split on higlight term and include term into parts
    let parts = text.split(new RegExp(`(${higlight})`, 'g'));
    return <span>{ parts.map((part, i) => 
        <span key={i} className={ part === higlight ? 'highlighted':''}>
            { part }
        </span>)
    } </span>;
  
  // style={part === higlight ? { fontWeight: 'bold' } : {} }
}

function secondsToHumanTime(num){
    const sec = num % 60
    const mins = ((num - sec)/60)%60
    const hrs = Math.floor((num-sec)/3600)
    
    const secStr = sec<10? '0' + sec : sec,
    minStr = mins<10? '0' + mins : mins,
    hrsStr = hrs<10? '0' + hrs : hrs
    return (hrsStr=='00'?'': hrsStr + ':') + minStr + ':' + secStr
}

function uploadedDateToHuman(string){
  const year  = parseInt(string.substring(0,4))
  const month = parseInt(string.substring(4,6))
  const day   = parseInt(string.substring(6))
  
  return `${day}-${month}-${year}`
}