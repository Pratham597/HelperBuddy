"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"

export default function AnimatedCounter({ from, to, duration = 2 }) {
  const spring = useSpring(from, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    spring.set(to)
  }, [spring, to])

  return <motion.span>{display}</motion.span>
}

