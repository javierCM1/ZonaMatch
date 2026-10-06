import { Button } from '../button'

export interface StepActionsProps {
	cancelLabel?: string
	continuationLabel?: string
	continueDisabled?: boolean
	/** Omitido → no se renderiza el botón de salida (no hay paso previo). */
	onCancel?: () => void
	onContinue: () => void
	/** Modificador visual, p. ej. `step-actions--end` para alinear a la derecha. */
	className?: string
}

export function StepActions({
	cancelLabel = 'Cancelar',
	continuationLabel = 'Continuar',
	continueDisabled = false,
	onCancel,
	onContinue,
	className = '',
}: StepActionsProps) {
	return (
		<footer className={`step-actions ${className}`.trim()}>
			{onCancel && (
				<Button className="button button--secondary" label={cancelLabel} onClick={onCancel} outlined />
			)}

			<Button
				className="button button--primary"
				disabled={continueDisabled}
				label={continuationLabel}
				onClick={onContinue}
			/>
		</footer>
	)
}
