import * as React from "react"

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
    <div className={className} style={style}>{children}</div>
  )
}
