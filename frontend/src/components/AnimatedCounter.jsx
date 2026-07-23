import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0)

  // Extract number and suffix from string value (e.g. "1,200+" -> number: 1200, suffix: "+", hasComma: true)
  const cleanValue = String(value)
  const numbersOnlyStr = cleanValue.replace(/[^0-9]/g, '')
  const target = parseInt(numbersOnlyStr, 10) || 0
  const suffix = cleanValue.replace(/[0-9,]/g, '')
  const hasComma = cleanValue.includes(',')

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  })

  useEffect(() => {
    if (!inView) return

    let animationFrameId;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);
      setCount(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, target, duration])

  const formatNumber = (num) => {
    if (hasComma) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return num.toString()
  }

  return (
    <span ref={ref}>
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
