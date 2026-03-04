'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent, useEffect } from 'react'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  onComplete?: (value: string) => void
}

export function OTPInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false,
  onComplete 
}: OTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Auto-focus no primeiro input quando o componente monta
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  useEffect(() => {
    // Chama onComplete quando o código está completo
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return

    // Permite apenas números
    const numericValue = inputValue.replace(/[^0-9]/g, '')
    
    if (numericValue === '') {
      // Backspace ou delete
      const newValue = value.split('')
      newValue[index] = ''
      onChange(newValue.join(''))
      return
    }

    // Se colar múltiplos dígitos
    if (numericValue.length > 1) {
      handlePaste(numericValue, index)
      return
    }

    // Atualiza o valor
    const newValue = value.split('')
    newValue[index] = numericValue[0]
    onChange(newValue.join(''))

    // Move para o próximo input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      
      const currentValue = value[index]
      
      if (currentValue) {
        // Remove o valor atual
        const newValue = value.split('')
        newValue[index] = ''
        onChange(newValue.join(''))
      } else if (index > 0) {
        // Move para o input anterior e remove seu valor
        const newValue = value.split('')
        newValue[index - 1] = ''
        onChange(newValue.join(''))
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
      setActiveIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handlePaste = (pasteData: string, startIndex: number = 0) => {
    if (disabled) return

    // Remove tudo que não é número
    const numericPaste = pasteData.replace(/[^0-9]/g, '').slice(0, length)
    
    if (numericPaste.length === 0) return

    // Distribui os valores pelos inputs
    const newValue = value.split('')
    for (let i = 0; i < numericPaste.length && (startIndex + i) < length; i++) {
      newValue[startIndex + i] = numericPaste[i]
    }
    onChange(newValue.join(''))

    // Move o foco para o próximo input vazio ou último
    const nextIndex = Math.min(startIndex + numericPaste.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
    setActiveIndex(nextIndex)
  }

  const handlePasteEvent = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text')
    handlePaste(pasteData, index)
  }

  const handleFocus = (index: number) => {
    setActiveIndex(index)
    // Seleciona o texto ao focar (facilita substituição)
    inputRefs.current[index]?.select()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => {
        const currentValue = value[index] || ''
        const isFilled = currentValue !== ''
        const isActive = activeIndex === index && !disabled

        return (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={currentValue}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePasteEvent(e, index)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`
              w-12 h-14 sm:w-14 sm:h-16 
              text-center text-2xl sm:text-3xl font-bold 
              border-2 rounded-lg
              transition-all duration-200
              outline-none
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
              ${isFilled 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-border bg-background text-foreground'
              }
              ${isActive 
                ? 'ring-4 ring-primary/20 border-primary scale-105' 
                : 'hover:border-primary/50'
              }
              disabled:hover:border-border
              focus:border-primary focus:ring-4 focus:ring-primary/20 focus:scale-105
              animate-in fade-in zoom-in duration-200
            `}
            style={{ 
              animationDelay: `${index * 50}ms`,
              fontVariantNumeric: 'tabular-nums'
            }}
            autoComplete="one-time-code"
            aria-label={`Dígito ${index + 1} do código`}
          />
        )
      })}
    </div>
  )
}
