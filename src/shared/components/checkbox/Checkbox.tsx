import type { ReactNode } from 'react'
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox'
import type { CheckboxProps as PrimeCheckboxProps, CheckboxContext } from 'primereact/checkbox'

export interface CheckboxProps extends Omit<PrimeCheckboxProps, 'className'> {
	className?: string
	label?: ReactNode
	labelClassName?: string
}

export function Checkbox({
	className = '',
	label,
	labelClassName = '',
	disabled = false,
	invalid = false,
	...props
}: CheckboxProps) {
	const checkbox = (
		<PrimeCheckbox
			{...props}
			className={label ? '' : className}
			disabled={disabled}
			invalid={invalid}
			pt={{
				// Marks the (invisible, absolutely-positioned) native input as the
				// `peer` so the visible box can react to its focus-visible state.
				input: {
					className: 'peer',
				},
				icon: {
					className: '!h-3.5 !w-3.5 !text-white',
				},
				box: ({ context }: { context: CheckboxContext }) => {
					const borderColor = invalid ? '!border-red-400' : context.checked ? '!border-emerald-500' : '!border-slate-300'
					const background = context.checked ? '!bg-emerald-500' : '!bg-white'

					return `!h-5 !w-5 !rounded-md !border-2 !transition-colors peer-focus-visible:!outline-none peer-focus-visible:!ring-2 peer-focus-visible:!ring-emerald-500/40 peer-focus-visible:!ring-offset-2 ${
						context.disabled ? '!cursor-not-allowed !opacity-60' : ''
					} ${borderColor} ${background}`
				},
			}}
		/>
	)

	if (!label) {
		return checkbox
	}

	return (
		<label
			className={`inline-flex items-center gap-2 text-sm text-slate-700 ${
				disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
			} ${className}`.trim()}
		>
			{checkbox}
			<span className={labelClassName}>{label}</span>
		</label>
	)
}
