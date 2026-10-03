import type { ReactNode } from 'react'
import { Slider as PrimeSlider } from 'primereact/slider'
import type { SliderProps as PrimeSliderProps } from 'primereact/slider'

const DEFAULT_RANGE_CLASS = '!rounded-full !bg-emerald-500'
const DEFAULT_HANDLE_CLASS =
	'!-mt-[10px] !-ml-[10px] !h-5 !w-5 !rounded-full !border-2 !border-emerald-500 !bg-white !shadow-sm !transition-colors hover:!border-emerald-600 focus:!outline-none focus:!shadow-[0_0_0_4px_rgba(16,185,129,0.25)]'

export interface SliderProps extends Omit<PrimeSliderProps, 'className'> {
	className?: string
	label?: ReactNode
	formatValue?: (value: number | [number, number]) => ReactNode	
	rangeClassName?: string	
	handleClassName?: string
}

function defaultFormatValue(value: number | [number, number]) {
	return Array.isArray(value) ? `${value[0]} - ${value[1]}` : `${value}`
}

export function Slider({
	className = '',
	label,
	formatValue = defaultFormatValue,
	value,
	min = 0,
	max = 100,
	disabled = false,
	rangeClassName = DEFAULT_RANGE_CLASS,
	handleClassName = DEFAULT_HANDLE_CLASS,
	...props
}: SliderProps) {
	const slider = (
		<PrimeSlider
			{...props}
			className={label ? '' : className}
			disabled={disabled}
			max={max}
			min={min}
			value={value}
			pt={{
				root: {
					className: '!h-1.5 !rounded-full !border-0 !bg-slate-200',
				},
				range: {
					className: rangeClassName,
				},
				handle: {
					className: handleClassName,
				},
			}}
		/>
	)

	if (!label) {
		return slider
	}

	const resolvedValue = value ?? (props.range ? ([min, max] as [number, number]) : min)

	return (
		<div className={`flex flex-col gap-2 ${className}`.trim()}>
			<div className="flex items-center justify-between text-sm">
				<span className="font-medium text-slate-700">{label}</span>
				<span className="text-slate-500">{formatValue(resolvedValue)}</span>
			</div>
			{slider}
		</div>
	)
}
