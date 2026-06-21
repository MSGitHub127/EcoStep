import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProgressRing from './ProgressRing.jsx'

function getCircles(container) {
  return container.querySelectorAll('circle')
}

describe('ProgressRing', () => {
  it('renders a track circle and a progress circle', () => {
    const { container } = render(<ProgressRing progress={0.5} />)
    expect(getCircles(container)).toHaveLength(2)
  })

  it('fully hides the progress circle at progress 0 (offset = full circumference)', () => {
    const { container } = render(<ProgressRing progress={0} size={100} stroke={10} />)
    const [, progressCircle] = getCircles(container)
    const circumference = 2 * Math.PI * ((100 - 10) / 2)
    expect(Number(progressCircle.getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference, 5)
  })

  it('fully reveals the ring at progress 1 (zero dash offset)', () => {
    const { container } = render(<ProgressRing progress={1} size={100} stroke={10} />)
    const [, progressCircle] = getCircles(container)
    expect(Number(progressCircle.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 5)
  })

  it('clamps out-of-range progress values instead of producing a broken ring', () => {
    const { container: over } = render(<ProgressRing progress={5} size={100} stroke={10} />)
    const [, overCircle] = getCircles(over)
    expect(Number(overCircle.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 5)

    const { container: under } = render(<ProgressRing progress={-2} size={100} stroke={10} />)
    const [, underCircle] = getCircles(under)
    const circumference = 2 * Math.PI * ((100 - 10) / 2)
    expect(Number(underCircle.getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference, 5)
  })
})
