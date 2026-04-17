import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FormField from './FormField'

describe('FormField', () => {
  const defaultProps = {
    label: 'Name',
    id: 'name',
    type: 'text',
    value: '',
    onChange: vi.fn(),
  }

  it('renders a label and input', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor/id', () => {
    render(<FormField {...defaultProps} />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('id', 'name')
  })

  it('passes through additional input props', () => {
    render(<FormField {...defaultProps} placeholder="Enter your name" type="text" />)
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })

  describe('without error', () => {
    it('does not render an error message', () => {
      render(<FormField {...defaultProps} />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not set aria-invalid on the input', () => {
      render(<FormField {...defaultProps} />)
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
    })

    it('does not set aria-describedby on the input', () => {
      render(<FormField {...defaultProps} />)
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('with error', () => {
    const errorProps = { ...defaultProps, error: 'Name is required' }

    it('renders an error message', () => {
      render(<FormField {...errorProps} />)
      expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
    })

    it('sets aria-invalid on the input', () => {
      render(<FormField {...errorProps} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('sets aria-describedby pointing to the error element', () => {
      render(<FormField {...errorProps} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'name-error')
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'name-error')
    })
  })
})
