import React from "react"
import classNames from "classnames"

interface PropsType {
  row: number
  column: number
  rowEnd?: number
  columnEnd?: number
  grabbed?: boolean
  className?: string
  style?: React.CSSProperties,
  children?: React.ReactNode
}

export default ({ row, column, rowEnd, columnEnd, grabbed, className, style, children }: PropsType) => {
  const styles: React.CSSProperties = {
    gridArea: `${row} / ${column} / ${rowEnd || "auto"} / ${columnEnd || "auto"}`,
  }
  return (
    <div
      className={classNames(["wrap", className])}
      aria-grabbed={grabbed || false}
      style={{ ...style, ...styles }}
    >
      {children}
    </div>
  )
}
