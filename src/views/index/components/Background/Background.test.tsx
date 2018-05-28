import * as React from "react"
import { render, mount } from "enzyme"
import toJson from "enzyme-to-json"

import { Background } from "./Background"
import store from "../../store/wallpaper"

describe("<Background />", () => {

  let component: React.ReactElement<Background>
  beforeEach(() => {
    component = <Background wallpaperStore={store} />
  })

  it("should render <Background />", () => {
    const wrapper = render(component)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it("should render <Background /> correctly", () => {
    const wrapper = render(component)
    expect(wrapper.length).toBe(2)
    expect(wrapper.first().prop("id")).toBe("bg")
    expect(wrapper.last().prop("id")).toBe("mask")
  })

  it("should calls componentDidMount", () => {
    const mock = jest.fn()
    Background.prototype.componentDidMount = mock
    mount(component)
    expect(mock).toHaveBeenCalled()
  })
})
