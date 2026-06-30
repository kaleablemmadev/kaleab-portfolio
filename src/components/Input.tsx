interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function Input({ type = 'text', label, placeholder, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-text dark:text-text-dark">
          {label}
        </label>
      )}
      <div className="flex flex-row gap-3">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-3 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
        />
        <button
          type="button"
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition"
          onClick={() => onChange(value)}
        >
          GO
        </button>
      </div>
    </div>
  )
}

export default Input;