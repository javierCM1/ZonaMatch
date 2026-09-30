import { forwardRef } from 'react'
import { InputNumber as PrimeInputNumber } from 'primereact/inputnumber'
import type { InputNumberProps as PrimeInputNumberProps } from 'primereact/inputnumber'

export interface InputNumberProps extends Omit<PrimeInputNumberProps, 'className'> {
	className?: string
	fullWidth?: boolean
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
	{ className = '', fullWidth = false, invalid = false, showButtons = false, ...props },
	ref,
) {
	const stateClasses = invalid
		? '!border-red-400 hover:!border-red-400 focus:!border-red-500 focus:!shadow-[0_0_0_4px_rgba(248,113,113,0.15)]'
		: '!border-slate-200 hover:!border-emerald-400 focus:!border-emerald-500 focus:!shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'

	return (
		<PrimeInputNumber
			{...props}
			className={`${fullWidth ? '!w-full' : ''} ${className}`.trim()}
			inputRef={ref}
			invalid={invalid}
			showButtons={showButtons}
			pt={{
				input: {
					root: {
						className: `!rounded-xl !border !bg-white !px-3.5 !py-2.5 !text-sm !text-slate-900 !shadow-sm !transition-colors placeholder:!text-slate-400 focus:!outline-none disabled:!cursor-not-allowed disabled:!bg-slate-50 disabled:!opacity-60 ${stateClasses} ${
							fullWidth ? '!w-full' : ''
						}`,
					},
				},
				buttonGroup: {
					className: '!gap-0.5',
				},
				incrementButton: {
					className:
						'!rounded-lg !border !border-slate-200 !bg-white !text-slate-500 !shadow-none hover:!bg-slate-50 hover:!text-slate-700',
				},
				decrementButton: {
					className:
						'!rounded-lg !border !border-slate-200 !bg-white !text-slate-500 !shadow-none hover:!bg-slate-50 hover:!text-slate-700',
				},
			}}
		/>
	)
})
