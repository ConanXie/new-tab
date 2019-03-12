import React from "react"
import { format } from "date-fns"

class DateTime extends React.Component {
  public timer: any
  public state = {
    time: "",
  }
  public updateTime = () => {
    this.setState({
      time: format(new Date(), "HH:mm")
    })
  }
  public componentDidMount() {
    const milliseconds = new Date().getMilliseconds()
    this.updateTime()
    this.timer = setTimeout(() => {
      this.updateTime()
      this.timer = setInterval(this.updateTime, 1000)
    }, 1000 - milliseconds)
  }
  public componentWillUnmount() {
    clearInterval(this.timer)
  }
  public render() {
    return (
      <h1>{this.state.time}</h1>
    )
  }
}

export default DateTime
