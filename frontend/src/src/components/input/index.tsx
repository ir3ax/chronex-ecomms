import * as React from 'react'

import { cn } from '../../utility/common'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    isError?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, isError, ...props }, ref) => {
        return (
            <>
                <input
                    type={type}
                    className={cn(
                        'flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        isError && 'border-red-500',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
            </>
        )
    },
)
Input.displayName = 'Input'

export { Input }
