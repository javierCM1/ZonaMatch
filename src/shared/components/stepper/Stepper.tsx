import type { ReactNode } from 'react'
import { Stepper as PrimeStepper } from 'primereact/stepper'
import type { StepperProps as PrimeStepperProps, StepperChangeEvent } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'

export type { StepperChangeEvent }

export interface StepperStep {
	label: string
	content?: ReactNode
}

export interface StepContext {
	active: boolean
	highlighted: boolean
}

export interface StepperProps extends Omit<PrimeStepperProps, 'className' | 'children'> {
	className?: string
	steps: StepperStep[]
	/** Tailwind classes for the step circle, given its active/highlighted state. Defaults to emerald. */
	numberClassName?: (context: StepContext) => string
	/** Tailwind classes for the connector between steps, given its highlighted state. Defaults to emerald. */
	separatorClassName?: (context: StepContext) => string
	/** Tailwind classes for the step title, given its active state. Defaults to slate. */
	titleClassName?: (context: StepContext) => string
}

function defaultNumberClassName({ active, highlighted }: StepContext) {
	return `!flex !h-8 !w-8 !shrink-0 !items-center !justify-center !rounded-full !border-2 !text-sm !font-semibold !transition-colors ${
		active
			? '!border-emerald-500 !bg-emerald-500 !text-white'
			: highlighted
				? '!border-emerald-500 !bg-white !text-emerald-600'
				: '!border-slate-300 !bg-white !text-slate-400'
	}`
}

function defaultSeparatorClassName({ highlighted }: StepContext) {
	return `!rounded-full !transition-colors !mx-2 !h-0.5 ${highlighted ? '!bg-emerald-500' : '!bg-slate-200'}`
}

function defaultTitleClassName({ active }: StepContext) {
	return `!ml-2 !whitespace-nowrap !text-sm !font-medium ${active ? '!text-slate-900' : '!text-slate-500'}`
}

export function Stepper({
	className = '',
	steps,
	orientation = 'horizontal',
	linear = false,
	numberClassName = defaultNumberClassName,
	separatorClassName = defaultSeparatorClassName,
	titleClassName = defaultTitleClassName,
	...props
}: StepperProps) {
	const vertical = orientation === 'vertical'
	const hasContent = steps.some((step) => step.content != null)

	return (
		<PrimeStepper
			{...props}
			className={className}
			linear={linear}
			orientation={orientation}
			pt={{
				nav: { className: '!m-0 !list-none !p-0' },
				panelContainer: {
					className: hasContent ? '!bg-transparent !p-0 !pt-6' : '!hidden',
				},
				stepperpanel: {
					header: {
						// PrimeReact fades `linear` steps to 60% opacity via `.p-disabled`; the
						// color-coded number/title already communicate state, so keep steps fully opaque.
						className: '!opacity-100',
					},
					action: {
						className:
							'!gap-2 !bg-transparent !p-0 focus-visible:!rounded-full focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-emerald-500 focus-visible:!ring-offset-2',
					},
					number: ({ context }: { context: StepContext }) => numberClassName(context),
					title: ({ context }: { context: StepContext }) => titleClassName(context),
					separator: ({ context }: { context: StepContext }) =>
						`${vertical ? '!mx-auto !my-1 !min-h-8 !w-0.5' : ''} ${separatorClassName(context)}`,
					content: {
						className: hasContent ? '!pt-2' : '!hidden',
					},
				},
			}}
		>
			{steps.map((step, index) => (
				<StepperPanel header={step.label} key={index}>
					{step.content}
				</StepperPanel>
			))}
		</PrimeStepper>
	)
}
