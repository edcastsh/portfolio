type Edge = 'top' | 'bottom' | 'left' | 'right'

type HintBubbleProps = {
  message: string
  edge: Edge
  visible: boolean
}

export function HintBubble({ message, edge, visible }: HintBubbleProps) {
  return (
    <div
      aria-live="polite"
      className={`hint-bubble hint-bubble--${edge} ${visible ? 'hint-bubble--visible' : ''}`}
      role="status"
    >
      {message}
    </div>
  )
}
