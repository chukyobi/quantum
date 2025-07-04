"use client"

import { useEffect, useRef } from "react"

export default function TradingViewMarketOverview() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Check if the script is already added to avoid duplicate loads
    if (!containerRef.current.querySelector("#tradingview-market-overview-script")) {
      const script = document.createElement("script")
      script.id = "tradingview-market-overview-script"
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
      script.async = true
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        dateRange: "12M",
        showChart: true,
        locale: "en",
        width: "100%",
        height: "100%",
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        plotLineColorGrowing: "rgba(41, 98, 255, 1)",
        plotLineColorFalling: "rgba(41, 98, 255, 1)",
        gridLineColor: "rgba(240, 243, 250, 0)",
        scaleFontColor: "rgba(106, 109, 120, 1)",
        belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
        belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
        belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
        belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
        symbolActiveColor: "rgba(41, 98, 255, 0.12)",
        tabs: [
          {
            title: "Indices",
            symbols: [
              { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
              { s: "FOREXCOM:NSXUSD", d: "US 100" },
              { s: "FOREXCOM:DJI", d: "Dow 30" },
              { s: "INDEX:NKY", d: "Nikkei 225" },
              { s: "INDEX:DEU40", d: "DAX Index" },
              { s: "FOREXCOM:UKXGBP", d: "UK 100" },
            ],
            originalTitle: "Indices",
          },
          {
            title: "Futures",
            symbols: [
              { s: "CME_MINI:ES1!", d: "S&P 500" },
              { s: "CME:6E1!", d: "Euro" },
              { s: "COMEX:GC1!", d: "Gold" },
              { s: "NYMEX:CL1!", d: "WTI Crude Oil" },
              { s: "NYMEX:NG1!", d: "Gas" },
              { s: "CBOT:ZC1!", d: "Corn" },
            ],
            originalTitle: "Futures",
          },
          {
            title: "Bonds",
            symbols: [
              { s: "CBOT:ZB1!", d: "T-Bond" },
              { s: "CBOT:UB1!", d: "Ultra T-Bond" },
              { s: "EUREX:FGBL1!", d: "Euro Bund" },
              { s: "EUREX:FBTP1!", d: "Euro BTP" },
              { s: "EUREX:FGBM1!", d: "Euro BOBL" },
            ],
            originalTitle: "Bonds",
          },
          {
            title: "Forex",
            symbols: [
              { s: "FX:EURUSD", d: "EUR to USD" },
              { s: "FX:GBPUSD", d: "GBP to USD" },
              { s: "FX:USDJPY", d: "USD to JPY" },
              { s: "FX:USDCHF", d: "USD to CHF" },
              { s: "FX:AUDUSD", d: "AUD to USD" },
              { s: "FX:USDCAD", d: "USD to CAD" },
            ],
            originalTitle: "Forex",
          },
        ],
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
