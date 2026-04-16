import { useState, type FormEvent, type ChangeEvent, type FocusEvent } from 'react'
import FormField from '../FormField/FormField'
import SelectField from '../SelectField/SelectField'
import styles from './ContactForm.module.css'

const COMPANY_SIZE_OPTIONS = [
  { value: '', label: 'Select company size' },
  { value: '1-10', label: '1-10 employees' },
  { value: '10-50', label: '10-50 employees' },
  { value: '50-100', label: '50-100 employees' },
  { value: '100-500', label: '100-500 employees' },
  { value: '500+', label: '500+ employees' },
]

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a subject' },
  { value: 'landing-pages', label: 'Building Landing pages' },
  { value: 'saas', label: 'SaaS Products' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'mobile', label: 'Mobile Applications' },
  { value: 'other', label: 'Other' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormState {
  name: string
  email: string
  companySize: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>
type TouchedFields = Partial<Record<keyof FormState, boolean>>

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!form.email.trim()) {
    errors.email = 'Company email is required'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.companySize) {
    errors.companySize = 'Please select a company size'
  }

  if (!form.subject) {
    errors.subject = 'Please select a subject'
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required'
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  return errors
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    companySize: '',
    subject: '',
    message: '',
  })

  const [touched, setTouched] = useState<TouchedFields>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(form)

  // Only show an error for a field if it's been blurred or a submit was attempted
  const [submitAttempted, setSubmitAttempted] = useState(false)

  function visibleError(field: keyof FormState): string | undefined {
    if (submitAttempted || touched[field]) return errors[field]
  }

  function handleChange(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleBlur(field: keyof FormState) {
    return (_e: FocusEvent) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitAttempted(true)
    if (Object.keys(errors).length === 0) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.15)" />
            <path d="M14 24l8 8 12-14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className={styles.successTitle}>Message sent!</h2>
          <p className={styles.successText}>
            Thank you for reaching out. Our sales team will get back to you as soon as possible.
          </p>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => {
              setSubmitted(false)
              setSubmitAttempted(false)
              setTouched({})
              setForm({ name: '', email: '', companySize: '', subject: '', message: '' })
            }}
          >
            ← Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <FormField
          label="Name"
          id="name"
          type="text"
          placeholder="Ethan Johnson"
          value={form.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          error={visibleError('name')}
          autoComplete="name"
        />
        <FormField
          label="Company Email"
          id="email"
          type="email"
          placeholder="ethan@johnson.com"
          value={form.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          error={visibleError('email')}
          autoComplete="email"
        />
        <SelectField
          label="Company Size"
          id="companySize"
          options={COMPANY_SIZE_OPTIONS}
          value={form.companySize}
          onChange={handleChange('companySize')}
          onBlur={handleBlur('companySize')}
          error={visibleError('companySize')}
        />
        <SelectField
          label="Subject"
          id="subject"
          options={SUBJECT_OPTIONS}
          value={form.subject}
          onChange={handleChange('subject')}
          onBlur={handleBlur('subject')}
          error={visibleError('subject')}
        />
      </div>

      <div className={styles.messageField}>
        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        <textarea
          id="message"
          className={`${styles.textarea} ${visibleError('message') ? styles.textareaError : ''}`}
          placeholder="Tell us about your project…"
          value={form.message}
          onChange={handleChange('message')}
          onBlur={handleBlur('message')}
          aria-describedby={visibleError('message') ? 'message-error' : undefined}
          aria-invalid={visibleError('message') ? true : undefined}
          rows={6}
        />
        {visibleError('message') && (
          <span id="message-error" className={styles.errorMsg} role="alert">
            {visibleError('message')}
          </span>
        )}
      </div>

      <button type="submit" className={styles.submitBtn}>
        Contact Sales
      </button>
    </form>
  )
}
