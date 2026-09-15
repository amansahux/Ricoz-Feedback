export default function Input({
  label,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-recoz-red">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg font-inter text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-recoz-red focus:border-transparent ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}