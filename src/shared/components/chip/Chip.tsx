import { Chip as PrimeChip } from 'primereact/chip'

export type ChipProps = React.ComponentProps<typeof PrimeChip>

export function Chip(props: ChipProps) {
  return <PrimeChip {...props} />
}