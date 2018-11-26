import * as React from "react"
import * as classNames from "classnames"

interface PropsType {
  row: number
  column: number
  rowEnd?: number
  columnEnd?: number
  grabbed?: boolean
  className?: string
  children?: React.ReactNode
}

export default ({ row, column, rowEnd, columnEnd, grabbed, className, children }: PropsType) => {
  const style: React.CSSProperties = {
    gridArea: `${row} / ${column} / ${rowEnd || "auto"} / ${columnEnd || "auto"}`,
  }
  return (
    <div className={classNames(["wrap", className])} aria-grabbed={grabbed || false} style={style}>{children}</div>
  )
}
