interface RollingLabelProps {
  children: string;
  className?: string;
}

export function RollingLabel({ children, className = '' }: RollingLabelProps) {
  return (
    <span className={`relative inline-flex overflow-hidden leading-[1.2] ${className}`}>
      <span className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 inline-block translate-y-full transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
