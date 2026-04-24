import { Select } from './Select'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  required?: boolean
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: FormSelectProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  )
}
