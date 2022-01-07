import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { differenceInMilliseconds, format, startOfDay, startOfHour, startOfMinute } from "date-fns"

import "./scallop.styl"

const ClockScallop: FC = () => {
  const dailRadius = 50
  const secondRadius = 34.5

  const [date, setDate] = useState("")
  const [hourDeg, setHourDeg] = useState(0)
  const [minuteDeg, setMinuteDeg] = useState(0)
  const [secondDeg, setSecondDeg] = useState(0)
  const [dateTextDeg, setDateTextDeg] = useState<number | null>(null)

  const clockEl = useRef<HTMLDivElement>(null)
  const dateTextEl = useRef<SVGTextElement>(null)

  // draw a circle path
  const dateTextPath = useMemo(() => {
    return `M ${
      dailRadius - secondRadius
    } ${dailRadius} a ${secondRadius} ${secondRadius} 0 1 1 0 0.1`
  }, [])

  // animate hands
  const updateTime = useCallback(() => {
    const now = new Date()

    const dateText = format(now, "ccc d")
    if (date !== "" && dateText !== date) {
      setTimeout(() => {
        initDateTextPosition()
      }, 100)
    }
    setDate(dateText)

    const startDay = differenceInMilliseconds(now, startOfDay(now))
    const startHour = differenceInMilliseconds(now, startOfHour(now))
    const startMinute = differenceInMilliseconds(now, startOfMinute(now))
    setHourDeg((startDay / 60 / 60 / 1000) * 30 - 90)
    setMinuteDeg((startHour / 60 / 1000) * 6 - 90)
    setSecondDeg((startMinute / 1000) * 6 - 90)

    window.requestAnimationFrame(updateTime)
  }, [])

  // calculate the date text initial position
  const initDateTextPosition = useCallback(() => {
    const width = dateTextEl.current?.getBoundingClientRect()?.width || 0
    const scale = (clockEl.current?.getBoundingClientRect()?.width || 0) / (dailRadius * 2)
    setDateTextDeg(((width / scale / (Math.PI * secondRadius)) * 180) / 2)
  }, [])

  useEffect(() => {
    initDateTextPosition()
    window.requestAnimationFrame(updateTime)
  }, [updateTime, initDateTextPosition])

  useEffect(() => {
    window.addEventListener("visibilitychange", updateTime, false)

    return () => window.removeEventListener("visibilitychange", updateTime, false)
  }, [])

  return (
    <div
      className="scallop-clock"
      ref={clockEl}
      style={{ visibility: dateTextDeg === null ? "hidden" : "visible" }}
    >
      <div className="dail"></div>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "relative" }}
      >
        <path id="circle" d={dateTextPath} />
        <text
          fill="#453c3c"
          fontSize="9px"
          fontWeight="500"
          style={{
            transformOrigin: "center",
            transform: `rotate(${secondDeg - (dateTextDeg || 0)}deg)`,
          }}
        >
          <textPath xlinkHref="#circle">{date}</textPath>
        </text>
        {/* normal text for calculate */}
        <text ref={dateTextEl} fill="#fff" opacity="0" fontSize="9px" fontWeight="500">
          {date}
        </text>
      </svg>
      <div
        className="hand hour"
        style={{
          transform: `translate(calc(var(--hand-height) / -2), -50%) rotate(${hourDeg}deg) scale(0.91)`,
        }}
      ></div>
      <div
        className="hand minute"
        style={{
          transform: `translate(calc(var(--hand-height) / -2), -50%) rotate(${minuteDeg}deg) scale(0.91)`,
        }}
      ></div>
      <div
        className="hand second"
        style={{
          transform: `translate(var(--second-hand-translate), -50%) rotate(${secondDeg}deg)`,
        }}
      ></div>
    </div>
  )
}

export default ClockScallop
