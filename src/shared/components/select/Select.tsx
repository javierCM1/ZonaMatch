import { Dropdown as PrimeDropdown } from 'primereact/dropdown'
import type { DropdownProps as PrimeDropdownProps } from 'primereact/dropdown'

export interface SelectProps extends Omit<PrimeDropdownProps, 'className'> {
	className?: string	
	panelClassName?: string
	fullWidth?: boolean
	/** Omite la superficie empaquetada (fondo, borde y sombra) para que el scope
	 *  que lo usa defina su propio aspecto, p. ej. un select inline sin caja. */
	plain?: boolean
}

const BOXED_CLASSES =
	'!rounded-xl !border !border-slate-200 !bg-white !shadow-sm !transition-colors [&.p-disabled]:!opacity-60 [&.p-invalid]:!border-red-400 [&.p-focus]:!border-emerald-500 [&.p-focus]:!shadow-[0_0_0_4px_rgba(16,185,129,0.15)] [&:not(.p-disabled):hover]:!border-emerald-400'

const INPUT_CLASSES = '!py-2.5 !pl-3.5 !text-sm !text-slate-900 [&.p-placeholder]:!text-slate-400'

export function Select({ className = '', panelClassName = '', fullWidth = false, plain = false, ...props }: SelectProps) {
	return (
		<PrimeDropdown
			{...props}
			className={`!items-center ${plain ? '' : BOXED_CLASSES} ${
				fullWidth ? '!flex !w-full' : ''
			} ${className}`.trim()}
			panelClassName={
				plain ? panelClassName : `!rounded-xl !border !border-slate-200 !shadow-lg ${panelClassName}`.trim()
			}
			pt={{
				...(plain ? {} : { input: { className: INPUT_CLASSES } }),
				trigger: {
					className: '!w-10 !text-slate-400',
				},
				item: {
					className:
						'!py-2.5 !text-sm !text-slate-700 [&.p-highlight]:!bg-emerald-50 [&.p-highlight]:!text-emerald-700 [&:not(.p-highlight):not(.p-disabled).p-focus]:!bg-slate-50',
				},
				itemGroup: {
					className: '!bg-white !text-xs !font-semibold !uppercase !tracking-wide !text-slate-400',
				},
				emptyMessage: {
					className: '!text-sm !text-slate-400',
				},
				filterInput: {
					className: '!rounded-lg !border !border-slate-200 !text-sm focus:!border-emerald-500 focus:!outline-none',
				},
			}}
		/>
	)
}
