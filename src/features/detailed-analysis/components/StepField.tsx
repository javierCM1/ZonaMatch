import type { ReactNode } from 'react'

export interface StepFieldProps {
	icon: string
	title: string
	hint?: string
	children?: ReactNode
}

export function StepField({ icon, title, hint, children }: StepFieldProps) {
	return (
		<div className="field">
			<div className="field__head">
				<span aria-hidden="true" className="field__icon">
					<i className={icon} />
				</span>

				<div className="field__headings">
					<h2 className="field__title">{title}</h2>
					{hint && <p className="field__hint">{hint}</p>}
				</div>
			</div>

			{children && <div className="field__body">{children}</div>}
		</div>
	)
}