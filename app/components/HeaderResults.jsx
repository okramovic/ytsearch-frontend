const React = require('react');

module.exports = ({initial, loadText, loading, excCount, vidCount, prevInput})=>{
  
  //let text = 'loading'
  
  if (loading) return(
    <h1 id="searchTermHeader" style={{ 
        marginTop: initial? '0.6em':'1.2em',
        textAlign: loading? 'center': ''
      }}
    >{loadText}</h1>
  )
  
  if (!excCount) return(
    <h1 id="searchTermHeader" className={ excCount===0? "":'hidden' }>Sorry, no results for '{prevInput}'</h1>
  )
  
  return (
    <h1 id="searchTermHeader" className={excCount>0? "":'hidden' }>
        Found '{prevInput}' in {excCount} excerpts from {vidCount} videos.
    </h1>
  )
}

function changeLoader(){
  
}
//  found "{prevInput}" <br/>in {excCount} excerpts <br/>in {vidCount} videos