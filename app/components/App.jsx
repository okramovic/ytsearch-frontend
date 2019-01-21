const React = require('react');
const UnorderedList = require('./UnorderedList');

/*const dependenciesArray = [
  'express - middleware for the node server',
  'react - for generating the views of the app',
  'react-dom - powers the rendering of elements to the DOM, typically paired with React',
  'webpack - for bundling all the javascript',
  'webpack-cli - command line support for webpack',
  'jsx-loader - allows webpack to load jsx files'
];
const componentsMade = [
  'HelloWorld - which is the view you are seeing now!',
  'UnorderedList - which takes an array of "items" and returns a <ul> element with <li>, elements of each of those items within it',
];*/


/* the main page for the index route of this app */
class HelloWorld extends React.Component {
  constructor(props){
    super(props)
    this.submitHandler = this.submitHandler.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
      input: '',
      prevInput:'',
      channels:[],
      vidCount: 0,
      excCount: 0
    }
  }
  inputChangeHandler(ev){
      this.setState({input: ev.target.value })
  }
  submitHandler(ev){
    ev.preventDefault()
    const query = this.state.input
    console.log('submitted', query)

    if (!query || typeof query != 'string') return;

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
              //const keys = Object.keys(oneChannel)
              
              // sort them alphabetically
              oneChannel.expt = oneChannel.expt.sort((a,b)=>{
                  const x = b.title.toLowerCase() > a.title.toLowerCase()
                  return x ? -1 : 1
              })
              
              // append only if there are exceprts
              if(oneChannel.expt.length)
                appendResultChannel(oneChannel.channel)

              for (let i=0; i<oneChannel.expt.length; i++) {
                const x = oneChannel.expt[i]  //[keys[i]] //oneChannel[keys[i]]
                
                if (!x.excerpts.length) continue;
                
                appendResultTitle(x.title)
                for (const ex of x.excerpts) appendResult(x.id, ex, query)
              }
          })
      }
    }
    xhr.send( JSON.stringify( {query} ) );

    //getS('form input').blur()

}
  render(){
  return (
    <div class={this.state.channels.length==0? "initial" : 'with_results'}>

      <button id="Q">?</button>
      
      <form onSubmit={this.submitHandler}>
        <input id="main" type="text" placeholder="search" 
               onChange={this.inputChangeHandler} value={this.state.input} autocomplete="off" />
        <p>fulltext search in your</p>
      </form>

      <h1 id="searchTermHeader" className={this.state.excCount? "":'hidden' }
        >found {this.state.excCount} excerpts in {this.state.vidCount} videos for "{this.state.prevInput}"</h1>
      
      <UnorderedList channels={this.state.channels} />

      
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