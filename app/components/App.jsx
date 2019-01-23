const React = require('react');
const Info = require('./Info');
const UnorderedList = require('./UnorderedList');


class HelloWorld extends React.Component {
  constructor(props){
    super(props)
    
    this.submitHandler = this.submitHandler.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    this.infoClickHandler = this.infoClickHandler.bind(this)
    this.channelChoiceHandler = this.channelChoiceHandler.bind(this)
    
    this.state = {
      showInfo: false,
      showChannelChoice: false,
      input: '',
      prevInput:'',
      channels:[],
      vidCount: 0,
      excCount: 0
    }
  }
  componentDidMount(){
    
  }
  infoClickHandler(ev){
    this.setState((prev)=>({showInfo: !prev.showInfo}))
  }
  channelChoiceHandler(ev){
    this.setState((prev)=>({showChannelChoice: !prev.showChannelChoice}))
  }
  inputChangeHandler(ev){
      this.setState({input: ev.target.value })
  }
  submitHandler(ev){
    ev.preventDefault()
    const query = this.state.input
    console.log('submitted', query)

    if (!query || typeof query != 'string' || query.trim()=='') return;

    document.querySelector('form input').blur()
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/searchtext", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        
          const res = JSON.parse(xhr.responseText)
          console.log('xhr response: ', res);
        
          const vidCount = res.reduce((tot, ch)=>tot+ch.expt.length, 0)
          const excCount = res.reduce((tot, ch)=>tot+ch.expt.reduce((t,curr)=>t+curr.excerpts.length,0), 0)
          
          this.setState({channels: res, vidCount, excCount, prevInput:query, input:'' },()=>{})
        
          return;

          res.map(oneChannel=>{
              // sort them alphabetically
              /*oneChannel.expt = oneChannel.expt.sort((a,b)=>{
                  const x = b.title.toLowerCase() > a.title.toLowerCase()
                  return x ? -1 : 1
              })*/
          })
      }
    }
    xhr.send( JSON.stringify( {query} ) );

    

}
  render(){
  return (
    <div class={this.state.channels.length==0? "initial" : 'with_results'}>

      <button id="Q" onClick={this.infoClickHandler}>?</button>
      
      <Info visible={this.state.showInfo}/>
      
      <form onSubmit={this.submitHandler}>
        <input id="main" type="text" placeholder="search" 
               onChange={this.inputChangeHandler} value={this.state.input} autocomplete="off" />
        <div className="full_width flex onsides marg_t_em">
          <div></div>
          <p className="no_margin">fulltext search in your</p>
          <button className="no_border no_bck" 
                  onClick={this.channelChoiceHandler}>{this.state.showChannelChoice ? '▲':'▼' }</button>
        </div>
        <div id="channelChoice" 
             className={ '' + (this.state.showChannelChoice? '':' hidden') }>choose channels</div>
      </form>

      <h1 id="searchTermHeader" className={this.state.excCount? "":'hidden' }
        >found {this.state.excCount} excerpts in {this.state.vidCount} videos for "{this.state.prevInput}"</h1>
      
      <UnorderedList channels={this.state.channels} query={this.state.prevInput}/>

      
      <div id='mycredit'>
        <p>made by me</p>
      </div>
      
    </div>
  );
  } // fulltext search in your favorite YT channels
}
// <p>made with love in Vienna by me</p>

module.exports = HelloWorld;



function secondsToHumanTime(num){
    const sec = num % 60
    const mins = ((num - sec)/60)%60
    const hrs = Math.floor((num-sec)/3600)
    
    const secStr = sec<10? '0' + sec : sec,
    minStr = mins<10? '0' + mins : mins,
    hrsStr = hrs<10? '0' + hrs : hrs
    return (hrsStr=='00'?'': hrsStr + ':') + minStr + ':' + secStr
}


function getSupportedChannels(){
  return new Promise((resolve, reject)=>{
  
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/dirs", true);
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