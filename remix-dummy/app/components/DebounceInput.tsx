import type { ChangeEvent, FC, InputHTMLAttributes } from "react";
import { useEffect, useState } from "react"

type Props = {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export const DebouncedInput: FC<Props> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState<number | string>(initialValue)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <input {...props} value={value} onChange={handleInputChange} />
}

export default DebouncedInput
