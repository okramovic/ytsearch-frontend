const React = require('react');

module.exports = function({excCount, vidCount}){
  return (
    <h1 id="searchTermHeader" className={excCount? "":'hidden' }
        >
        found<br/> "{this.props.prevInput}" <br/>in {this.state.excCount} excerpts <br/>in {this.state.vidCount} videos
    </h1>
  )
}