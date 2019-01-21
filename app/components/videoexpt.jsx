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
    
      return (
        this.props.expt.map((x,i)=>{
                           return (
                             <div key={i}>{x.title}
                               {x.excerpts.map((e,i)=>{
                                 return <p>{e.text}</p>
                               })
                               }
                             </div>
                             
                          )
      })
      )
      
    
  }
}

module.exports = VideoList;