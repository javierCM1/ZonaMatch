import type { FormEvent, InputHTMLAttributes } from 'react'
import { Button } from 'primereact/button'

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  onSubmit?: (value: string) => void
}

export function SearchBar({ onSubmit, className = '', ...props }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.(props.value?.toString() ?? '')
  }

  return (
    <form
      className={`flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 ${className}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <i aria-hidden="true" className="pi pi-search text-slate-400" />
      <input
        {...props}
        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
      <Button
        aria-label="Buscar"
        className="!h-8 !w-8 !bg-transparent !p-0 !text-slate-500 hover:!bg-slate-100"
        icon="pi pi-arrow-right"
        rounded
        type="submit"
      />
    </form>
  )
}