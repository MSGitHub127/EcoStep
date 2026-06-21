import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomLogForm from './CustomLogForm.jsx'

function setup() {
  const onSubmit = vi.fn()
  render(<CustomLogForm onSubmit={onSubmit} />)
  return { onSubmit, user: userEvent.setup() }
}

async function openForm(user) {
  await user.click(screen.getByText(/log a custom action/i))
}

describe('CustomLogForm', () => {
  it('starts collapsed, showing only the "log a custom action" trigger', () => {
    setup()
    expect(screen.getByText(/log a custom action/i)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/what did you do/i)).not.toBeInTheDocument()
  })

  it('opens the form on click and can be cancelled back to collapsed', async () => {
    const { user } = setup()
    await openForm(user)
    expect(screen.getByPlaceholderText(/what did you do/i)).toBeInTheDocument()

    await user.click(screen.getByText(/cancel/i))
    expect(screen.queryByPlaceholderText(/what did you do/i)).not.toBeInTheDocument()
  })

  it('does not submit with an empty label', async () => {
    const { user, onSubmit } = setup()
    await openForm(user)
    await user.type(screen.getByPlaceholderText(/kg co/i), '2')
    await user.click(screen.getByText(/^log it$/i))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit with a zero or negative kg value', async () => {
    const { user, onSubmit } = setup()
    await openForm(user)
    await user.type(screen.getByPlaceholderText(/what did you do/i), 'Skipped a flight')
    await user.type(screen.getByPlaceholderText(/kg co/i), '-3')
    await user.click(screen.getByText(/^log it$/i))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a trimmed label, numeric kg, and the selected category, then resets and collapses', async () => {
    const { user, onSubmit } = setup()
    await openForm(user)
    await user.type(screen.getByPlaceholderText(/what did you do/i), '  Biked to work  ')
    await user.type(screen.getByPlaceholderText(/kg co/i), '2.5')
    await user.click(screen.getByText('Transport'))
    await user.click(screen.getByText(/^log it$/i))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('Biked to work', 2.5, 'transport')
    // form collapses back to the trigger after a successful submit
    expect(screen.getByText(/log a custom action/i)).toBeInTheDocument()
  })

  it('truncates an overly long label to 60 characters even if the maxLength attribute is bypassed', async () => {
    const { user, onSubmit } = setup()
    await openForm(user)
    const labelInput = screen.getByPlaceholderText(/what did you do/i)
    // fireEvent.change sets the DOM value directly, bypassing the maxLength
    // attribute the way a programmatic paste or devtools edit could.
    fireEvent.change(labelInput, { target: { value: 'x'.repeat(200) } })
    await user.type(screen.getByPlaceholderText(/kg co/i), '1')
    await user.click(screen.getByText(/^log it$/i))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const submittedLabel = onSubmit.mock.calls[0][0]
    expect(submittedLabel).toHaveLength(60)
  })
})
