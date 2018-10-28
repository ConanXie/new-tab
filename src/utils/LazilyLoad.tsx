import * as React from "react"

interface Modules {
  [name: string]: () => Promise<{}>
}
interface Components {
  [name: string]: React.ComponentType<any>
}

interface PropsType {
  modules: Modules
  children: (components: Components) => React.ReactNode
}

class LazilyLoad extends React.Component<PropsType> {
  public state = {
    isLoaded: false,
    modules: {},
  }

  private _isMounted: boolean = false

  public componentDidMount() {
    this._isMounted = true
    this.load()
  }

  public componentDidUpdate(previous: PropsType) {
    const shouldLoad = !!Object.keys(this.props.modules).filter((key) => {
      return this.props.modules[key] !== previous.modules[key]
    }).length
    if (shouldLoad) {
      this.load()
    }
  }

  public componentWillUnmount() {
    this._isMounted = false
  }

  private load() {
    this.setState({
      isLoaded: false,
    })

    const { modules } = this.props
    const keys = Object.keys(modules)

    Promise.all(keys.map((key) => modules[key]()))
      .then(values => (keys.reduce((agg, key, index) => {
        agg[key] = values[index]
        return agg
      }, {})))
      .then(result => {
        if (!this._isMounted) {
          return
        }
        this.setState({ modules: result, isLoaded: true })
      })
  }

  public render() {
    if (!this.state.isLoaded) {
      return null
    }
    return React.Children.only(this.props.children(this.state.modules))
  }
}

/**
 * 高阶函数，用于组件内部懒加载其它组件
 */
export const LazilyLoadFactory = (Component: React.SFC, modules: Modules) => {
  return (props: {}) => (
    <LazilyLoad modules={modules}>
      {(mods) => <Component {...mods} {...props} />}
    </LazilyLoad>
  )
}

export const importLazy = (promise: Promise<{}>) => (
  promise.then((result: { default: string }) => result.default)
)

export default LazilyLoad
