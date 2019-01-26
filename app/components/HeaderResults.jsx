const React = require('react');

module.exports = ({excCount, vidCount, prevInput})=>{
  
  if (!excCount) return(
    <h1 id="searchTermHeader" className={ excCount===0? "":'hidden' }>Sorry, no results for "{prevInput}"</h1>
  )
  
  return (
    <h1 id="searchTermHeader" className={excCount>0? "":'hidden' }>
        Found {prevInput} in {excCount} excerpts in {vidCount} videos.
    </h1>
  )
}

//  found "{prevInput}" <br/>in {excCount} excerpts <br/>in {vidCount} videos