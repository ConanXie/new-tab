import React, { FC } from "react"
import SvgIcon from "@mui/material/SvgIcon"
import { SxProps, Theme } from "@mui/material/styles"

interface Props {
  className?: string
  sx?: SxProps<Theme>
}

const Logo: FC<Props> = (props) => (
  <SvgIcon {...props}>
    <path
      d={`M19.4,3.1c1.2,1.3,2.2,2.8,2.6,4.5c0,0.1,0,0.3-0.1,0.3L16,11.4c-0.1,0.1-0.2,0.1-0.3,0l-2.5-1.5\
C13,9.8,13,9.7,13,9.6V6.7c0-0.1,0.1-0.2,0.1-0.3L19,3C19.1,3,19.3,3,19.4,3.1z M14.8,20.1c0,0.1-0.1,0.3-0.2,0.3\
c-1.7,0.4-3.5,0.4-5.3,0c-0.1,0-0.2-0.2-0.2-0.3l0-6.8c0-0.1,0.1-0.2,0.1-0.3l2.5-1.5c0.1-0.1,0.2-0.1,0.3,0l2.5,1.5\
c0.1,0.1,0.1,0.1,0.1,0.3L14.8,20.1z M2,7.6c0.5-1.7,1.4-3.3,2.6-4.5C4.7,3,4.9,3,5,3l5.9,3.4C11,6.5,11,\
6.6,11,6.7v2.9c0,0.1-0.1,0.2-0.1,0.3l-2.5,1.5c-0.1,0.1-0.2,0.1-0.3,0L2.1,8C2,7.9,2,7.8,2,7.6z`}
    />
  </SvgIcon>
)

export default Logo
