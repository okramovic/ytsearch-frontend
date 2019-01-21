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
    console.log('construct')
    this.submitHandler = this.submitHandler.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
      input: '',
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
          console.log(vidCount, excCount)
          
          this.setState({channels: res, vidCount, excCount },()=>{
            console.log('chans', this.state.channels)
          })
        
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

      <form onSubmit={this.submitHandler}>
        <input id="main" type="text" placeholder="search" 
               onChange={this.inputChangeHandler} value={this.state.input} autocomplete="off" />
        <p>fulltext search in your</p>
      </form>

      <h1 id="searchTermHeader" className={this.state.excCount? "":'hidden' }
        >found {this.state.excCount} excerpts in {this.state.vidCount} videos</h1>
      
      <UnorderedList channels={this.state.channels} />

      
      <div id='mycredit'>
        <p>made</p>
      </div>
      
    </div>
  );
  } // fulltext search in your favorite YT channels
}
// <p>made with love in Vienna by me</p>

module.exports = HelloWorld;



function appendResultChannel(channel){

    const CT = 'https://yt3.ggpht.com/a-/AAuE7mC56ctnjTBFVmFaDttL3sC26U2CRiICqBgJ-g=s288-mo-c-c0xffffffff-rj-k-no'
    const Jeremy = 'https://yt3.ggpht.com/a-/AAuE7mBtvK6ioufwJFDGRT9WOvEykaDnAo0jGPOwvQ=s288-mo-c-c0xffffffff-rj-k-no'
    const Siraj = 'https://yt3.ggpht.com/a-/AAuE7mAfNzuo-vOC8wdETbqIPU4UbnknsxCbCj3lLg=s176-c-k-c0x00ffffff-no-rj-mo'
    const Twominute = 'https://yt3.ggpht.com/a-/AAuE7mBCBo51MwaRPnZWRH-BvZXhTCejRrbWhzYxuA=s48-mo-c-c0xffffffff-rj-k-no'

    let iconUrl
    if (channel == 'Coding train') iconUrl = CT
    else if (channel.match(/fastai/))  iconUrl = Jeremy
    else if (channel.match(/siraj raval/i))  iconUrl = Siraj
    else if (channel.match(/two minute papers/i))  iconUrl = Twominute
    

    const divOuter = document.createElement('div')
    divOuter.classList = ['channel_outer']
    
    const collapse = document.createElement('button')
    collapse.innerText = 'hide'
    collapse.classList = ['collapse_button']

    const divInner = document.createElement('div')
    divInner.classList = ['channel_inner']

        const img = document.createElement('img')
        img.src = iconUrl
        img.alt = 'channel icon'
        img.classList = ['channel_thumb']
        if (iconUrl) divInner.appendChild(img)

        const h = document.createElement('h2')
        h.innerText = channel
        h.classList = ['channel_header']

    divInner.appendChild(h)
    divOuter.appendChild(divInner)
    divOuter.appendChild(collapse)
    getS('#results').appendChild(divOuter)
}
function appendResultTitle(title){
    const h = document.createElement('h3')
    h.innerText = title
    getS('#results').appendChild(h)
}
function appendResult(id, exc, query){
    // https://www.youtube.com/watch?v=myPWWrkq5t0
    // https://youtu.be/myPWWrkq5t0?t=167

    // to highlight query string in text = first make it a span
    exc.text = exc.text.replace(new RegExp(query, 'gi'), `<span class='highlighted'>${query}</span>`)

    // show time @ instead of id


    const li = document.createElement('li')    
    li.innerHTML = `<a href='https://youtu.be/${id}?t=${exc.time}' target='_blank'>${secondsToHumanTime(exc.time)}</a>
                    <p class='excerpt_text'>${exc.text}</p>`

    getS('#results').appendChild(li)
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