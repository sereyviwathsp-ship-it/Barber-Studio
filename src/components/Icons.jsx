export function Icon({ children, className = 'w-4 h-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

export const ScissorsIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="6" cy="6" r="3" />
    <path d="M8.12 8.12 12 12" />
    <path d="M20 4 8.12 15.88" />
    <circle cx="6" cy="18" r="3" />
    <path d="M14.8 14.8 20 20" />
  </Icon>
)

export const ArrowUpRightIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </Icon>
)

export const AwardIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </Icon>
)
