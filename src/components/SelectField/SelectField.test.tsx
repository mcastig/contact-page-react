import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SelectField from './SelectField'

const OPTIONS = [
  { value: '', label: 'Select an option' },
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

describe('SelectField', () => {
  const defaultProps = {
    label: 'Category',
    id: 'category',
    options: OPTIONS,
    value: '',
    onChange: vi.fn(),
  }

  it('renders a label and select', () => {
    render(<SelectField {...defaultProps} />)
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(<SelectField {...defaultProps} />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('Select an option')
    expect(options[1]).toHaveTextContent('Option A')
    expect(options[2]).toHaveTextContent('Option B')
  })

  it('associates label with select via htmlFor/id', () => {
    render(<SelectField {...defaultProps} />)
    const select = screen.getByLabelText('Category')
    expect(select).toHaveAttribute('id', 'category')
  })

  describe('without error', () => {
    it('does not render an error message', () => {
      render(<SelectField {...defaultProps} />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not set aria-invalid', () => {
      render(<SelectField {...defaultProps} />)
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('with error', () => {
    const errorProps = { ...defaultProps, error: 'Please select an option' }

    it('renders an error message', () => {
      render(<SelectField {...errorProps} />)
      expect(screen.getByRole('alert')).toHaveTextContent('Please select an option')
    })

    it('sets aria-invalid on the select', () => {
      render(<SelectField {...errorProps} />)
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('sets aria-describedby pointing to the error element', () => {
      render(<SelectField {...errorProps} />)
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'category-error')
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'category-error')
    })
  })
})
