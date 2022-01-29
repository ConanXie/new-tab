import React, { FC, useEffect, useRef, useState } from "react"
import format from "date-fns/format"
import Typography from "@mui/material/Typography"

interface Props {
  col: number
  row: number
}

const DateTime: FC<Props> = ({ col, row }) => {
  const timerRef = useRef<number>()
  const [time, setTime] = useState("")

  const updateTime = () => {
    setTime(format(new Date(), "HH,mm"))
  }

  useEffect(() => {
    const milliseconds = new Date().getMilliseconds()
    updateTime()

    window.setTimeout(() => {
      updateTime()
      timerRef.current = window.setInterval(updateTime, 1000)
    }, 1000 - milliseconds)

    return () => clearInterval(timerRef.current)
  }, [])

  const [hour, minute] = time.split(",")

  const minAxis = Math.min(row, col)

  return (
    <Typography
      sx={{
        fontWeight: "normal",
        fontSize: `clamp(${32 * minAxis}px, ${10 * minAxis}vw, ${120 * minAxis}px)`,
        color: "var(--accent1-100)",
        textAlign: "center",
        lineHeight: "1",
      }}
    >
      {hour}
      <br />
      {minute}
    </Typography>
  )
}

export default DateTime
