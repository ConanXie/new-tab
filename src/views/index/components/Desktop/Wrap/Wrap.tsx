import React, { FC } from "react"
import classNames from "classnames"

interface Props {
  row: number
  column: number
  rowEnd?: number
  columnEnd?: number
  grabbed?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const Wrap: FC<Props> = ({
  row,
  column,
  rowEnd,
  columnEnd,
  grabbed,
  className,
  style,
  children,
}) => {
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

export default Wrap
