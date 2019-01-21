const React = require('react');

class VideoList extends React.Component{
  constructor(props){
    super(props)
    
    //this.submitHandler = this.submitHandler.bind(this)
    //this.inputChangeHandler = this.inputChangeHandler.bind(this)
    
    this.state = {
    }
  }
  render(){
    return(
      {expt.map(x=><p>video</p>)}
      
    )
  }
}

module.exports = VideoList;