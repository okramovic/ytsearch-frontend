const React = require('react');
const Info = require('./Info');
const UnorderedList = require('./UnorderedList');
const HeaderResults = require('./HeaderResults');



class HelloWorld extends React.Component {
  constructor(props){
    super(props)
    
    this.submitHandler = this.submitHandler.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    this.infoClickHandler = this.infoClickHandler.bind(this)
    this.channelChoiceHandler = this.channelChoiceHandler.bind(this)
    this.checkboxHandler = this.checkboxHandler.bind(this)
    this.termsHandler = this.termsHandler.bind(this)
    
    this.textInput = React.createRef();
    
    this.state = {
      showInfo: false,
      showTerms: false,
      showChannelChoice: false,
      loading:false,
      loadText: 'loading',
      suppChannels: [],
      input: '',
      prevInput:'',
      channels:[],
      vidCount: 0,
      excCount: -1,
      
    }
  }
  componentDidMount(){
      getSupportedChannels()
      .then(res=>{
        const obj = res.map(chan=>({name: chan, active:true}))
        this.setState({suppChannels: obj})
      })
      if (innerWidth>500) {
        //console.log('over 500',this.textInput.current );
        this.textInput.current.focus();
        this.textInput.current.placeholder = ''
      } //else console.log('not 500')
  }
  infoClickHandler(ev){
    this.setState((prev)=>({showInfo: !prev.showInfo, showTerms: false}))
  }
  termsHandler(){
    this.setState(prev=>({
        showInfo: false,
        showTerms: !prev.showTerms,
      })
    )
  }
  channelChoiceHandler(ev){
    this.setState((prev)=>({showChannelChoice: !prev.showChannelChoice}))
  }
  checkboxHandler(name){
    this.setState((prev)=>{
      const sel = prev.suppChannels.find(chan=>chan.name===name)
      sel.active= !sel.active
      return {suppChannels: prev.suppChannels}
    }) //, ()=> console.log('updated',this.state.suppChannels))
  }
  inputChangeHandler(ev){
      this.setState({input: ev.target.value })
  }
  submitHandler(ev){
    ev.preventDefault()
    const query = this.state.input
    
    const chans = '?channels=' + this.state.suppChannels.filter(chan=>chan.active).map(chan=>chan.name)
    console.log('submitted', typeof query, query, chans)
    if (!query || query.trim()=='' || 
         query.trim().length == 1 || 
        /^\d+$/.test(query) || 
        chans== '?channels=') 
      return console.log('not valid search');

    document.querySelector('form input').blur()
    
    
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/searchtext" + chans, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        
          const res = JSON.parse(xhr.responseText)
          console.log('xhr response: ', res);
        
          const vidCount = res.reduce((tot, ch)=>tot+ch.expt.length, 0)
          const excCount = res.reduce((tot, ch)=>tot+ch.expt.reduce((t,curr)=>t+curr.excerpts.length,0), 0)
          
          this.setState({loading: false, channels: res, vidCount, excCount, prevInput:query, input:'' },()=>{})
        
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
    setTimeout(()=>xhr.send( JSON.stringify( {query} ) ), 7000);

    this.setState({loading: true})

}
  render(){
    const initial = this.state.channels.length===0
    const self = this
    let text = 'loading'
    
    /*self.mytimer = setInterval(()=>{
      
      if (!self.state.loading) {
        
        clearInterval(self.mytimer)
        console.log('clearing interval')
      };
      text += '.'
      console.log('text', text)
    }, 1000)*/
    
    return (
      <div className={this.state.loading? 'centered':(initial ? "initial" : 'with_results')}
          style={{height: initial? '100vh': 'auto'}}>

        <button id="Q" onClick={this.infoClickHandler}>?</button>
        <Info visible={this.state.showInfo}/>

        <div style={{ display: initial ? 'block':'none' }}></div>

        <div id="form_container" className={ "flex col bck_white " + ( initial ? 'corn_round': 'corn_sharp') }
          style={{ width:  getFormContanierWidth(initial, this.state.loading)   }}
          >
          <form onSubmit={this.submitHandler}>
            <input id="main" type="text" placeholder="search" ref={this.textInput}
                   onChange={this.inputChangeHandler} value={this.state.input} autocomplete="off" />
          </form>
          <div className="full_width flex onsides pad_bot_em bck_white">
              <div className="pad_lr_15"></div>
              <p className="no_margin">fulltext search in your favourite channels</p>
              <button className="no_border no_bck pad_lr_15" 
                      onClick={this.channelChoiceHandler}>{this.state.showChannelChoice ? '▲':'▼' }</button>
          </div>
          <div id="channelChoice" 
               className={ 'col ' + (this.state.showChannelChoice? ' flex ':' hidden ') }>
              <h5>less channels equals less waiting time</h5>
              {this.state.suppChannels.map((chan, i)=>{
                 return (<div>
                     <input type="checkbox" value={chan.name} checked={chan.active}
                         onClick={()=>this.checkboxHandler(chan.name)}/>
                     <span key={i}>{chan.name}</span>
                  </div>
                )
              })}
          </div>
        </div>

        <div id="results_container" style={{ display: this.state.loading ? 'flex': (initial? 'none':'flex') }}>
          <HeaderResults initial={initial} loading={this.state.loading} 
                loadText={text}
                excCount={this.state.excCount} vidCount={this.state.vidCount} 
                prevInput={this.state.prevInput}
          />
          <UnorderedList style={{display: this.state.loading? 'none': 'flex'}} channels={this.state.channels} query={this.state.prevInput}/>
        </div>



        <div id='mycredit' style={{ position: this.state.loading? 'fixed':(initial ? 'static':'fixed') }}>
          <div className="pad_lr_15"></div>
          <p>made in Vienna by <a href='https://twitter.com/okram_ovic' target='_blank'>me</a></p>
          <button onClick={this.termsHandler}>Terms</button>
        </div>
        
        <div id="terms" style={{display: this.state.showTerms ? 'flex': 'none'}}>
          <h4>Terms of service & Privacy policy</h4>
          <p>All valid search requests are stored with date it was made. 
            Only these two pieces of information are stored on server side, nothing else is (no IP address, no country etc). 
            They are stored for unlimited amount of time.</p>
          <p>No information is being stored in your browser.</p>
          <p>Search accuracy is not guaranteed.</p>
          <p>By using the search tool you agree with above mentioned conditions of usage.</p>
        </div>

      </div>
    );
  } // fulltext search in your favorite YT channels
}
// <p>made with love in Vienna by me</p>

module.exports = HelloWorld;

function getFormContanierWidth(initial, loading){
  if(!loading && initial) return 'auto'
  if(!loading && !initial) return '100%'
  if(loading && !initial) return '100%'
     
  return initial? 'auto': (loading ? 'auto':'100%') 
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


function getSupportedChannels(){
  return new Promise((resolve, reject)=>{
  
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/dirs", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        const res = JSON.parse(xhr.responseText)
        resolve(res)
      }
    }
    xhr.send( JSON.stringify( {} ) );
  })
}