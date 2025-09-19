import { useCallback } from 'react'

export const useSmoothScroll = () => {
    const scrollToElement = useCallback((elementId: string, duration: number = 1000) => {
        const element = document.getElementById(elementId)
        if (!element) return

        const start = window.pageYOffset
        const target = element.offsetTop - 100 // offset for header
        const distance = target - start
        let startTime: number | null = null

        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime
            const timeElapsed = currentTime - startTime
            const run = easeInOutCubic(timeElapsed, start, distance, duration)
            window.scrollTo(0, run)
            if (timeElapsed < duration) requestAnimationFrame(animation)
        }

        requestAnimationFrame(animation)
    }, [])

    // Easing function for smooth animation
    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
        t /= d / 2
        if (t < 1) return c / 2 * t * t * t + b
        t -= 2
        return c / 2 * (t * t * t + 2) + b
    }

    return { scrollToElement }
}
