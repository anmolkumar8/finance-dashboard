import { useId } from 'react'
import { NavLink } from 'react-router-dom'

type BrandLogoProps = {
  size?: number
  className?: string
  title?: string
  /** Navigate home on click (keyboard + screen-reader friendly) */
  linkHome?: boolean
}

/**
 * Hand-tuned mark: slightly imperfect geometry, warm ink-on-paper palette, subtle hover life.
 * Feels illustrated rather than generated.
 */
export function BrandLogo({ size = 40, className = '', title, linkHome = true }: BrandLogoProps) {
  const uid = useId().replace(/:/g, '')
  const wash = `logo-wash-${uid}`
  const deep = `logo-deep-${uid}`

  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className="shrink-0 overflow-visible transition-[transform,filter] duration-500 ease-[cubic-bezier(0.34,1.45,0.64,1)] group-hover/logo:scale-[1.06] group-hover/logo:drop-shadow-[0_10px_22px_rgba(13,148,136,0.35)] group-active/logo:scale-[0.96] dark:group-hover/logo:drop-shadow-[0_12px_28px_rgba(45,212,191,0.2)]"
      aria-hidden
      focusable="false"
    >
      {title && !linkHome ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={wash} x1="6" y1="5" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0fdfa" />
          <stop offset="0.45" stopColor="#5eead4" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id={deep} x1="10" y1="8" x2="28" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#134e4a" stopOpacity="0.92" />
          <stop offset="1" stopColor="#042f2e" stopOpacity="0.98" />
        </linearGradient>
      </defs>
      {/* Slightly asymmetric “stamp” — not a perfect rounded square */}
      <path
        fill={`url(#${wash})`}
        d="M6.5 11.2c.8-3.1 3.4-5.5 6.6-6.1l16.2-2.8c3.4-.6 6.7 1.1 8.2 4.2l3.4 7.4c1 2.1.9 4.5-.2 6.5l-7.8 14.2c-1.6 2.9-4.9 4.5-8.2 3.9l-15.4-2.6c-3.1-.5-5.6-2.8-6.5-5.8L5.4 17.6c-.7-2.1-.4-4.4 1.1-6.4z"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeOpacity="0.22"
        strokeWidth="1.1"
        strokeLinejoin="round"
        d="M7.8 12.5c.7-2.6 2.9-4.7 5.6-5.2l14.8-2.5c3-.5 5.9.9 7.2 3.5l3.1 6.8c.9 1.9.8 4-.2 5.8l-7.1 13c-1.4 2.6-4.4 4-7.4 3.5l-14-2.4c-2.8-.5-5-2.3-5.8-4.9l-2.5-8.4c-.6-1.8-.4-3.7.7-5.2z"
      />
      {/* Bars: hand-placed, slightly different widths & angles */}
      <g className="origin-center transition-transform duration-500 ease-out group-hover/logo:-rotate-[2.5deg]">
        <path
          fill={`url(#${deep})`}
          d="M9.2 27.4l1.1-8.6c.1-.7.7-1.2 1.4-1.1l2.8.4c.7.1 1.2.8 1.1 1.5l-1 8.5c-.1.8-.8 1.3-1.5 1.2l-2.8-.4c-.7-.1-1.2-.8-1.1-1.5z"
        />
        <path
          fill={`url(#${deep})`}
          d="M16.8 27.6l1.4-13.2c.1-.8.8-1.4 1.6-1.3l2.7.3c.8.1 1.4.9 1.3 1.7l-1.3 13.1c-.1.9-.9 1.5-1.7 1.4l-2.7-.3c-.8-.1-1.4-.9-1.3-1.7z"
        />
        <path
          fill={`url(#${deep})`}
          d="M24.6 27.8l1.6-17.4c.1-.9.9-1.5 1.8-1.4l2.6.3c.9.1 1.5 1 1.4 1.9l-1.6 17.3c-.1 1-1 1.6-1.9 1.5l-2.6-.3c-.9-.1-1.5-1-1.4-1.9z"
        />
      </g>
      {/* Imperfect sketch line — wobbly bezier */}
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeOpacity="0.55"
        d="M8.5 24.2c3.8-4.2 7.9-6.1 12.6-6.8 4.2-.6 8.6.1 12.4 2.1"
      />
      {/* Warm accent — intentionally off-center */}
      <circle cx="30.5" cy="9.5" r="2.4" fill="#fbbf24" opacity="0.95" />
      <circle cx="29.8" cy="8.9" r="0.9" fill="#fef3c7" opacity="0.7" />
    </svg>
  )

  const shell = `group/logo inline-flex rounded-2xl p-0.5 outline-none transition-[box-shadow,background-color] duration-300 hover:bg-teal-500/5 focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-elevated)] dark:hover:bg-teal-400/10 dark:focus-visible:ring-teal-400/40 dark:focus-visible:ring-offset-[var(--color-elevated)] ${className}`

  if (linkHome) {
    return (
      <NavLink
        to="/"
        end
        className={shell}
        aria-label={title || 'Atlas Finance home'}
        title="Back to overview"
      >
        {svg}
      </NavLink>
    )
  }

  return <span className={shell}>{svg}</span>
}
