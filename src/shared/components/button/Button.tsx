import { Button as PrimeButton } from 'primereact/button'
import type { ButtonProps as PrimeButtonProps } from 'primereact/button'

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'outlined'
	| 'text'
	| 'link'

export interface ButtonProps extends Omit<PrimeButtonProps, 'className'> {
	className?: string
	variant?: ButtonVariant
	fullWidth?: boolean
}

const severityByVariant: Partial<
	Record<ButtonVariant, PrimeButtonProps['severity']>
> = {
	secondary: 'secondary',
	success: 'success',
	danger: 'danger',
}

export function Button({
	className = '',
	variant = 'primary',
	fullWidth = false,
	severity,
	outlined,
	text,
	link,
	...props
}: ButtonProps) {
	const classes = [
		'rounded-md transition-colors duration-150',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
		fullWidth ? 'w-full' : '',
		className,
	]
		.filter(Boolean)
		.join(' ')

	return (
		<PrimeButton
			{...props}
			className={classes}
			severity={severity ?? severityByVariant[variant]}
			outlined={outlined ?? variant === 'outlined'}
			text={text ?? variant === 'text'}
			link={link ?? variant === 'link'}
		/>
	)
}
