import { useEffect, useId, useMemo, useState } from 'react'

import { cn } from '../../lib/cn'

import { Input } from './Input'

export interface SearchableOption {
  value: string
  label: string
  searchText?: string
}

interface SearchableSelectProps {
  label: string
  selectedValue: string
  onSelect: (value: string) => void
  options: SearchableOption[]
  placeholder?: string
  required?: boolean
  emptyMessage?: string
  helperText?: string
  disabled?: boolean
}

export function SearchableSelect({
  label,
  selectedValue,
  onSelect,
  options,
  placeholder,
  required = false,
  emptyMessage = 'No matches found.',
  helperText,
  disabled = false,
}: SearchableSelectProps) {
  const listId = useId()
  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? null,
    [options, selectedValue],
  )
  const [query, setQuery] = useState(selectedOption?.label ?? '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setQuery(selectedOption?.label ?? '')
  }, [selectedOption])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) {
      return options.slice(0, 8)
    }

    return options
      .filter((option) => {
        const haystack = `${option.label} ${option.searchText ?? ''}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
      .slice(0, 8)
  }, [normalizedQuery, options])

  const showOptions = !disabled && isFocused

  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <Input
          value={query}
          placeholder={placeholder}
          required={required && !selectedValue}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false)
              if (!selectedOption && !query.trim()) {
                onSelect('')
              }
            }, 100)
          }}
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)

            if (!nextQuery.trim()) {
              onSelect('')
              return
            }

            const exactMatch = options.find(
              (option) => option.label.toLowerCase() === nextQuery.trim().toLowerCase(),
            )

            if (exactMatch) {
              onSelect(exactMatch.value)
            }
          }}
          className="pr-10"
          aria-expanded={showOptions}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-400">
          Search
        </span>

        {showOptions ? (
          <div
            id={listId}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-50',
                    selectedValue === option.value ? 'bg-slate-100 text-slate-900' : 'text-slate-700',
                  )}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    onSelect(option.value)
                    setQuery(option.label)
                    setIsFocused(false)
                  }}
                >
                  <span>{option.label}</span>
                  {selectedValue === option.value ? <span className="text-xs font-medium text-slate-500">Selected</span> : null}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-slate-500">{emptyMessage}</p>
            )}
          </div>
        ) : null}
      </div>
      {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
    </label>
  )
}