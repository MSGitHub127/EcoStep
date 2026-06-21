import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionChecklist from './ActionChecklist.jsx'
import { CHECKLIST_ITEMS } from '../data/baseline.js'

describe('ActionChecklist', () => {
  it('renders every checklist item with its point value', () => {
    render(<ActionChecklist checked={{}} onToggle={() => {}} />)
    CHECKLIST_ITEMS.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument()
      expect(screen.getByText(`+${item.points}`)).toBeInTheDocument()
    })
  })

  it('calls onToggle with the clicked item when a row is pressed', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<ActionChecklist checked={{}} onToggle={onToggle} />)

    await user.click(screen.getByText(CHECKLIST_ITEMS[0].label))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(CHECKLIST_ITEMS[0])
  })

  it('renders a checked item with a strikethrough state', () => {
    const checked = { [CHECKLIST_ITEMS[0].id]: true }
    render(<ActionChecklist checked={checked} onToggle={() => {}} />)
    expect(screen.getByText(CHECKLIST_ITEMS[0].label)).toHaveClass('line-through')
  })
})
