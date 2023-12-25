import { StylesConfig } from 'react-select'
import { OptionType } from '../Select'

type Config = {
  isMulti?: boolean
}
export const customSelectStyles: ({
  isMulti,
}: Config) => StylesConfig<OptionType> = ({ isMulti }) => ({
  control: (provided) => ({
    ...provided,
    color: 'rgb(var(--text-primary))',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    minHeight: 'auto',
    boxShadow: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    paddingBottom: 0,
    paddingTop: 0,
    color: 'var(--text-primary)',
    '&:hover': {
      color: 'var(--text-disabled)',
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    color: 'var(--text-primary)',
    '&:hover': {
      color: 'var(--text-disabled)',
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    background: `var(--text-disabled)`,
    margin: 0,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  menu: (provided) => ({
    ...provided,
    left: 0,
    background: 'rgb(var(--bg-200))',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    paddingTop: isMulti ? 4 : 0,
    paddingBottom: isMulti ? 4 : 0,
    color: 'rgb(var(--text-primary))',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    return { ...provided, color: 'rgb(var(--text-primary))', opacity }
  },
  option: (provided, state) => ({
    ...provided,
    cursor: 'pointer',
    color: 'rgb(--text-primary)',
    background: state.isFocused ? 'rgb(var(--bg-300))' : 'transparent',
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: '0.375rem',
    background: '#3b82f6',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'var(--text-primary)',
    fontSize: '100%',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderRadius: '0.375rem',
    '&:hover': {
      background: '#2563eb',
      color: 'currentcolor',
      filter: 'brightness(1.2)',
    },
  }),
})
