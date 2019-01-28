const React = require('react');


module.exports = ({initial, loadText, loading, excCount, vidCount, prevInput})=>{
  
  if (loadText.match(/(input must be|select at least one channel)/i)) {
    console.log('invalid', loadText)
    return(
      <h1 id="searchTermHeader" style={{ 
          marginTop: initial? '0.6em':'1.2em',
          textAlign: loading? 'center': ''
      }}>{loadText}</h1>
    )
  }  
  
  
  if (loading) return(
    <h1 id="searchTermHeader" style={{ 
        marginTop: initial? '0.6em':'1.2em',
        textAlign: loading? 'center': ''
    }}>{loadText}</h1>
  )
  
  if (excCount) return (
      <h1 id="searchTermHeader" className={excCount>0? '':'hidden' }>
          Found '{prevInput}' in {excCount} {excCount>1 ? 'excerpts':'excerpt'} from {vidCount} {vidCount>1 ?'videos':'video'}.
  </h1>)
  
  return(<h1 id="searchTermHeader" className={ excCount===0? '':'hidden' }>Sorry, no results for '{prevInput}'</h1>)
}