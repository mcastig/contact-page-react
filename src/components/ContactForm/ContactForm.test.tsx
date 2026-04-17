import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import ContactForm from './ContactForm'

// Helper to fill all required fields with valid data
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ethan Johnson')
  await user.type(screen.getByLabelText('Company Email'), 'ethan@johnson.com')
  await user.selectOptions(screen.getByLabelText('Company Size'), '1-10')
  await user.selectOptions(screen.getByLabelText('Subject'), 'saas')
  await user.type(screen.getByLabelText('Message'), 'Tell us about your project details here.')
}

describe('ContactForm', () => {
  describe('initial render', () => {
    it('renders all form fields', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Size')).toBeInTheDocument()
      expect(screen.getByLabelText('Subject')).toBeInTheDocument()
      expect(screen.getByLabelText('Message')).toBeInTheDocument()
    })

    it('renders the submit button', () => {
      render(<ContactForm />)
      expect(screen.getByRole('button', { name: 'Contact Sales' })).toBeInTheDocument()
    })

    it('shows no validation errors on initial render', () => {
      render(<ContactForm />)
      expect(screen.queryAllByRole('alert')).toHaveLength(0)
    })
  })

  describe('validate function (unit coverage)', () => {
    it('name must be at least 2 characters', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const nameInput = screen.getByLabelText('Name')
      await user.type(nameInput, 'A')
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Name must be at least 2 characters')
      })
    })

    it('accepts a valid email', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const emailInput = screen.getByLabelText('Company Email')
      await user.type(emailInput, 'user@example.com')
      await user.tab()
      expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument()
    })

    it('rejects an invalid email', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const emailInput = screen.getByLabelText('Company Email')
      await user.type(emailInput, 'not-an-email')
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address')
      })
    })

    it('message must be at least 10 characters', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const textarea = screen.getByLabelText('Message')
      await user.type(textarea, 'Short')
      await user.tab()
      await waitFor(() => {
        expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument()
      })
    })
  })

  describe('blur validation', () => {
    it('shows name required error after blurring empty name field', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const nameInput = screen.getByLabelText('Name')
      await user.click(nameInput)
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
      })
    })

    it('shows email required error after blurring empty email field', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const emailInput = screen.getByLabelText('Company Email')
      await user.click(emailInput)
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Company email is required')
      })
    })

    it('shows company size error after blurring without selecting', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const select = screen.getByLabelText('Company Size')
      await user.click(select)
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Please select a company size')
      })
    })

    it('shows subject error after blurring without selecting', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const select = screen.getByLabelText('Subject')
      await user.click(select)
      await user.tab()
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Please select a subject')
      })
    })

    it('shows message required error after blurring empty message', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const textarea = screen.getByLabelText('Message')
      await user.click(textarea)
      await user.tab()
      await waitFor(() => {
        expect(screen.getByText('Message is required')).toBeInTheDocument()
      })
    })

    it('clears an error when the field becomes valid', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      const nameInput = screen.getByLabelText('Name')
      // Trigger error
      await user.click(nameInput)
      await user.tab()
      await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
      // Fix the field
      await user.click(nameInput)
      await user.type(nameInput, 'Alice')
      await waitFor(() => expect(screen.queryByText('Name is required')).not.toBeInTheDocument())
    })
  })

  describe('submit validation', () => {
    it('shows all 5 errors when submitting an empty form', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => {
        expect(screen.getAllByRole('alert')).toHaveLength(5)
      })
    })

    it('does not submit when there are validation errors', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      expect(screen.queryByText('Message sent!')).not.toBeInTheDocument()
    })
  })

  describe('successful submission', () => {
    it('shows the success state after filling out and submitting the form', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => {
        expect(screen.getByText('Message sent!')).toBeInTheDocument()
      })
    })

    it('shows the thank-you message in the success state', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => {
        expect(screen.getByText(/Our sales team will get back to you/)).toBeInTheDocument()
      })
    })

    it('shows the "Send another message" button in the success state', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Send another message/ })).toBeInTheDocument()
      })
    })
  })

  describe('reset after success', () => {
    it('returns to the empty form when "Send another message" is clicked', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => expect(screen.getByText('Message sent!')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: /Send another message/ }))

      await waitFor(() => {
        expect(screen.queryByText('Message sent!')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Contact Sales' })).toBeInTheDocument()
      })
    })

    it('clears all field values after reset', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => expect(screen.getByText('Message sent!')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: /Send another message/ }))

      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('')
        expect(screen.getByLabelText('Company Email')).toHaveValue('')
        expect(screen.getByLabelText('Message')).toHaveValue('')
      })
    })

    it('shows no errors immediately after reset', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: 'Contact Sales' }))
      await waitFor(() => expect(screen.getByText('Message sent!')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: /Send another message/ }))

      await waitFor(() => {
        expect(screen.queryAllByRole('alert')).toHaveLength(0)
      })
    })
  })
})
