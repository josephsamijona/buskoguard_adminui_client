// src/components/ui/input.jsx
import * as React from "react"
import PropTypes from "prop-types"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium " +
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
          "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
}

export { Input }
