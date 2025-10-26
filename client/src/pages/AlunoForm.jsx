import { useForm } from "react-hook-form"
import { InputField } from "../components/InputField"

export const AlunoForm = () => {
  const { register, formState: { errors } } = useForm();
  return (
    <form className="w-full m-auto">
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <InputField
        label="Nome*"
        name="nome"
        type="text"
        placeholder="Digite seu nome"
        register={register}
        validation={{ required: "O nome é obrigatório" }}
        error={errors.nome?.message}
        />
        <InputField
          label="Sobrenome*"
          name="sobrenome"
          type="text"
          placeholder="Digite seu sobrenome"
          register={register}
          validation={{ required: "O sobrenome é obrigatório" }}
          error={errors.sobrenome?.message}
        />
      </div>
    </form>
  )
}
