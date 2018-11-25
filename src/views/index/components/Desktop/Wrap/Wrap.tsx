import * as React from "react"
import * as classNames from "classnames"

interface PropsType {
  row: number
  column: number
  rowEnd?: number
  columnEnd?: number
  children?: React.ReactNode
  className?: string
}

export default ({ row, column, rowEnd, columnEnd, children, className }: PropsType) => {
  const style: React.CSSProperties = {
    gridArea: `${row} / ${column} / ${rowEnd || "auto"} / ${columnEnd || "auto"}`,
  }
  return (
    <div className={classNames(["wrap", className])} aria-grabbed="false" style={style}>{children}</div>
  )
}
