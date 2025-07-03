"use client"

import { useEffect, useRef } from "react"

export default function TradingViewTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Check if the script is already added to avoid duplicate loads
    if (!containerRef.current.querySelector("#tradingview-timeline-script")) {
      const script = document.createElement("script")
      script.id = "tradingview-timeline-script"
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
      script.async = true
      script.innerHTML = JSON.stringify({
        feedMode: "all_symbols",
        isTransparent: true,
        displayMode: "regular",
        width: "100%",
        height: "100%",
        colorTheme: "light",
        locale: "en",
      })

      containerRef.current.appendChild(script)
    }

    // Clean up the script when component unmounts
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}
