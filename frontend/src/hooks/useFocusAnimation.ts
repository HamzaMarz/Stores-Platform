import { useCallback, useState } from 'react'

export const useFocusAnimation = () => {
    const [focusedElement, setFocusedElement] = useState<string | null>(null)

    const focusOnElement = useCallback((elementId: string, duration: number = 3000) => {
        setFocusedElement(elementId)
        
        // إزالة التركيز بعد المدة المحددة
        setTimeout(() => {
            setFocusedElement(null)
        }, duration)
    }, [])

    const isElementFocused = useCallback((elementId: string) => {
        return focusedElement === elementId
    }, [focusedElement])

    return { focusOnElement, isElementFocused, focusedElement }
}
