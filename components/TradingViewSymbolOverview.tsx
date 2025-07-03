"use client"

import { useEffect, useRef } from "react"

interface TradingViewSymbolOverviewProps {
  symbol: string
}

export default function TradingViewSymbolOverview({ symbol }: TradingViewSymbolOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [[symbol, symbol.includes("BINANCE") ? symbol.split(":")[1] : symbol.split(":")[1] || symbol]],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "light",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      backgroundColor: "rgba(255, 255, 255, 1)",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d", "1m", "3m", "12m", "60m"],
    })

    containerRef.current.appendChild(script)

    // Clean up the script when component unmounts
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}
