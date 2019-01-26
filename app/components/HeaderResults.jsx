const React = require('react');

module.exports = ({excCount, vidCount, prevInput})=>{
  
  if (!excCount) return(
    <h1 id="searchTermHeader" className={ excCount===0? "":'hidden' }>Sorry, no results for "{prevInput}"</h1>
  )
  
  return (
    <h1 id="searchTermHeader" className={excCount>0? "":'hidden' }>
        found "{prevInput}" <br/>in {excCount} excerpts <br/>in {vidCount} videos
    </h1>
  )
}