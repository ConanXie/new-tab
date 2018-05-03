import * as React from "react"
import { shallow, ShallowWrapper } from "enzyme"
import Dialog from "material-ui/Dialog"
import Button from "material-ui/Button"

import ColorPicker from "./ColorPicker"

describe("<ColorPicker />", () => {
  let wrapper: ShallowWrapper
  const handleClose = jest.fn()
  const color = "#FF9800"

  beforeAll(() => {
    wrapper = shallow(
      <ColorPicker color={color} open={true} onClose={handleClose} />
    )
  })

  it("should render <Dialog /> correctly", () => {
    expect(wrapper.find(Dialog)).toHaveLength(1)
    expect(wrapper.find(Button)).toHaveLength(2)
  })

  it("should initialize state correctly", () => {
    expect(wrapper.state("color")).toEqual(color)
  })

  it("should call `handleClose` when click button", () => {
    const buttons = wrapper.find(Button)

    expect(buttons.first().children().text()).toEqual("CANCEL")
    expect(buttons.last().children().text()).toEqual("OK")

    buttons.last().simulate("click")
    expect(handleClose).toBeCalled()
  })
})
