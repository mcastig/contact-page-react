import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Logo from './Logo'

describe('Logo', () => {
  it('renders an SVG with the correct aria-label', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'Becv' })).toBeInTheDocument()
  })

  it('renders an SVG element', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
