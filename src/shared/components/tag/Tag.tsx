import { Tag as PrimeTag } from 'primereact/tag'
import type { TagProps as PrimeTagProps } from 'primereact/tag'

export type TagVariant = 'neutral' | 'success' | 'info' | 'warning' | 'danger'

export interface TagProps extends Omit<PrimeTagProps, 'className' | 'severity'> {
	className?: string
	variant?: TagVariant
}

const VARIANT_CLASSES: Record<TagVariant, string> = {
	neutral: '!bg-slate-100 !text-slate-600',
	success: '!bg-emerald-100 !text-emerald-700',
	info: '!bg-sky-100 !text-sky-700',
	warning: '!bg-amber-100 !text-amber-700',
	danger: '!bg-red-100 !text-red-700',
}

export function Tag({ className = '', variant = 'neutral', rounded = true, ...props }: TagProps) {
	return (
		<PrimeTag
			{...props}
			className={`!border-0 !px-2.5 !py-1 !text-xs !font-medium ${VARIANT_CLASSES[variant]} ${className}`.trim()}
			rounded={rounded}
		/>
	)
}
