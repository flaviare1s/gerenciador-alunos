/**
 * Componente reutilizável de input field com label e validação.
 * 
 * Este componente exibe um campo de entrada (input) com um label associado.
 * Também exibe mensagens de erro de validação quando aplicável.
 * Utiliza a biblioteca react-hook-form para registro e validação do campo.
 */

export const InputField = ({
  label,
  name,
  type = "text",
  register,
  error,
  validation,
  placeholder
}) => {
  return (
    <div className="flex-1">
      <label className="text-sm font-medium text-neutral-black" htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        {...register(name, validation)}
        placeholder={placeholder}
        className="text-gray-medium bg-[#dbdbdb20] w-full px-5 py-[13px] font-medium font-sm rounded-md border border-border-input mt-2"
      />
      {error && <small className="text-xs font-medium text-primary">{error}</small>}
    </div>
  )
}
