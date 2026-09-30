import type { ReactNode } from 'react'
import { Dialog as PrimeDialog } from 'primereact/dialog'
import type { DialogProps as PrimeDialogProps } from 'primereact/dialog'

export type DialogSize = 'sm' | 'md' | 'lg' | 'full'

export interface DialogProps extends Omit<PrimeDialogProps, 'className' | 'header' | 'footer'> {
	className?: string
	header?: ReactNode
	footer?: ReactNode
	/** Preset width (or height, for "full"). Defaults to "md". */
	size?: DialogSize
}

const SIZE_CLASSES: Record<DialogSize, string> = {
	sm: '!w-[92vw] sm:!w-[26rem]',
	md: '!w-[92vw] sm:!w-[34rem]',
	lg: '!w-[92vw] sm:!w-[48rem]',
	full: '!h-[90vh] !w-[95vw] sm:!h-[85vh] sm:!w-[85vw]',
}

export function Dialog({
	className = '',
	header,
	footer,
	size = 'md',
	draggable = false,
	resizable = false,
	...props
}: DialogProps) {
	return (
		<PrimeDialog
			{...props}
			className={`!rounded-xl !border-0 !shadow-xl ${SIZE_CLASSES[size]} ${className}`.trim()}
			draggable={draggable}
			footer={footer}
			header={header}
			resizable={resizable}
			pt={{
				mask: {
					className: '!bg-slate-950/40 !p-4 backdrop-blur-sm',
				},
				header: {
					className:
						'!flex !items-center !justify-between !gap-4 !rounded-t-xl !border-b !border-slate-100 !bg-white !px-6 !py-4',
				},
				headerTitle: {
					className: '!text-base !font-semibold !text-slate-900',
				},
				closeButton: {
					className:
						'!h-8 !w-8 !rounded-full !text-slate-400 !transition-colors hover:!bg-slate-100 hover:!text-slate-600 focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-emerald-500 focus-visible:!ring-offset-2',
				},
				content: {
					className: `!bg-white !px-6 !py-4 !text-sm !text-slate-600 ${footer ? '' : '!rounded-b-xl'}`,
				},
				footer: {
					className:
						'!flex !items-center !justify-end !gap-3 !rounded-b-xl !border-t !border-slate-100 !bg-white !px-6 !py-4',
				},
			}}
		/>
	)
}
