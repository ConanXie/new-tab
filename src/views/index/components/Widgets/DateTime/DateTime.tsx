import React, { FC, useEffect, useRef, useState } from "react"
import format from "date-fns/format"

const DateTime: FC = () => {
  const timerRef = useRef<NodeJS.Timeout>()
  const [time, setTime] = useState("")
  
  const updateTime = () => {
    setTime(format(new Date(), "HH:mm"))
  }

  useEffect(() => {
    const milliseconds = new Date().getMilliseconds()
    updateTime()

    setTimeout(() => {
      updateTime()
      timerRef.current = setInterval(updateTime, 1000)
    }, 1000 - milliseconds)

    return () => clearInterval(timerRef.current!)
  }, [])

  return (
    <h1>{time}</h1>
  )
}

export default DateTime
