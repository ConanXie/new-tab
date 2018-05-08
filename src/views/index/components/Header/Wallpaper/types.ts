export interface OnError {
  onError(m: string): void,
  onChange(f: File | Blob): void
}

export interface ItemPropsType {
  disabled: boolean
}
