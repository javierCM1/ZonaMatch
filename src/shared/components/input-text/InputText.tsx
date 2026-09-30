import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { InputText as PrimeInputText } from 'primereact/inputtext'
import type { InputTextProps as PrimeInputTextProps } from 'primereact/inputtext'

export interface InputTextProps extends Omit<PrimeInputTextProps, 'className'> {
	className?: string
	/** Classes for the wrapping element, only rendered when leftIcon/rightIcon are used. */
	wrapperClassName?: string
	fullWidth?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(function InputText(
	{ className = '', wrapperClassName = '', fullWidth = false, leftIcon, rightIcon, invalid = false, ...props },
	ref,
) {
	const stateClasses = invalid
		? '!border-red-400 hover:!border-red-400 focus:!border-red-500 focus:!shadow-[0_0_0_4px_rgba(248,113,113,0.15)]'
		: '!border-slate-200 hover:!border-emerald-400 focus:!border-emerald-500 focus:!shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'

	const input = (
		<PrimeInputText
			{...props}
			className={`!rounded-xl !border !bg-white !px-3.5 !py-2.5 !text-sm !text-slate-900 !shadow-sm !transition-colors placeholder:!text-slate-400 focus:!outline-none disabled:!cursor-not-allowed disabled:!bg-slate-50 disabled:!opacity-60 ${stateClasses} ${
				fullWidth ? '!w-full' : ''
			} ${leftIcon ? '!pl-10' : ''} ${rightIcon ? '!pr-10' : ''} ${className}`.trim()}
			invalid={invalid}
			ref={ref}
		/>
	)

	if (!leftIcon && !rightIcon) {
		return input
	}

	return (
		<div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${wrapperClassName}`.trim()}>
			{leftIcon && (
				<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
					{leftIcon}
				</span>
			)}
			{input}
			{rightIcon && (
				<span className="absolute inset-y-0 right-3 flex items-center text-slate-400">{rightIcon}</span>
			)}
		</div>
	)
})
