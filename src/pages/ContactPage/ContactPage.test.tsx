import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ContactPage from './ContactPage'

describe('ContactPage', () => {
  it('renders the main heading', () => {
    render(<ContactPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Interested in our')
  })

  it('renders the subheading text', () => {
    render(<ContactPage />)
    expect(screen.getByText(/Fill out the form to view details/)).toBeInTheDocument()
  })

  it('renders the logo', () => {
    render(<ContactPage />)
    expect(screen.getByRole('img', { name: 'Becv' })).toBeInTheDocument()
  })

  it('renders the contact form submit button', () => {
    render(<ContactPage />)
    expect(screen.getByRole('button', { name: 'Contact Sales' })).toBeInTheDocument()
  })
})
