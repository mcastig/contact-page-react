import type { SelectHTMLAttributes } from 'react'
import styles from './SelectField.module.css'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  id: string
  options: { value: string; label: string }[]
  error?: string
}

export default function SelectField({ label, id, options, error, ...selectProps }: SelectFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.selectWrapper}>
        <select
          id={id}
          className={`${styles.select} ${error ? styles.selectError : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          {...selectProps}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.errorMsg} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
