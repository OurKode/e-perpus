export function IslamicPattern({ className }: { className?: string }) {
    return (
        <div className={`absolute inset-0 z-0 pointer-events-none opacity-[0.03] ${className}`}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern
                        id="islamic-pattern"
                        x="0"
                        y="0"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Simple 8-point heavy geometric star/rosette motif */}
                        <path
                            d="M30 0 L37.07 22.93 L60 30 L37.07 37.07 L30 60 L22.93 37.07 L0 30 L22.93 22.93 Z"
                            fill="currentColor"
                        />
                        <circle cx="30" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
            </svg>
        </div>
    );
}
