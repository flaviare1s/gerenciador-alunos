import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { toast } from "react-hot-toast";
import { createMatricula } from "../services/aluno-curso";
import { getAllCursos } from "../services/curso";
import { AlunoCursosList } from "../components/AlunoCursosList";

export const AlunoForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [cursos, setCursos] = useState([]);
  const cep = watch("cep");

  useEffect(() => {
    const fetchAddress = async () => {
      if (cep && cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (!data.erro) {
            setValue("rua", data.logradouro);
            setValue("bairro", data.bairro);
            setValue("cidade", data.localidade);
            setValue("estado", data.uf);
          }
        } catch {
          toast.error("Não foi possível buscar o endereço para o CEP informado.");
        }
      }
    };

    fetchAddress();
  }, [cep, setValue]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getAllCursos();
        setCursos(data);
      } catch {
        toast.error("Não foi possível carregar os cursos disponíveis.");
      }
    };

    fetchCursos();
  }, []);

  const handleMatricula = async (event) => {
    event.preventDefault();
    const cursoId = event.target.curso.value;
    const dataConclusao = event.target.dataConclusao.value;

    try {
      await createMatricula({ cursoId, dataConclusao });
      toast.success("Aluno matriculado com sucesso!");
    } catch {
      toast.error("Erro ao matricular aluno. Tente novamente.");
    }
  };

  return (
    <form className="w-full m-auto" onSubmit={handleMatricula}>
      <div className="flex flex-col sm:flex-row gap-6 w-full mb-[26px]">
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
      <div className="flex flex-col sm:flex-row gap-6 w-full mb-[26px]">
        <InputField
          label="Data de nascimento*"
          name="dataNascimento"
          type="date"
          placeholder="Digite sua data de nascimento"
          register={register}
          error={errors.dataNascimento?.message}
        />
        <InputField
          label="CPF*"
          name="cpf"
          type="text"
          placeholder="Digite seu CPF"
          register={register}
          validation={{ required: "O CPF é obrigatório" }}
          error={errors.cpf?.message}
        />
        <InputField
          label="Gênero"
          name="genero"
          type="text"
          placeholder="Digite seu gênero"
          register={register}
          error={errors.genero?.message}
        />
      </div>
      <div className="w-full md:w-1/2 mb-[26px]">
        <InputField
          label="Email*"
          name="email"
          type="email"
          placeholder="Digite seu email"
          register={register}
          error={errors.email?.message}
        />
      </div>
      <h2 className="text-black font-medium text-[22px] py-4">Localização</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[26px]">
        <InputField
          label="CEP*"
          name="cep"
          type="text"
          placeholder="Digite seu CEP"
          register={register}
          validation={{ required: "O CEP é obrigatório" }}
          error={errors.cep?.message}
        />
        <InputField
          label="País*"
          name="pais"
          type="text"
          placeholder="Digite seu país"
          register={register}
          validation={{ required: "O país é obrigatório" }}
          error={errors.pais?.message}
        />
        <InputField
          label="Rua*"
          name="rua"
          type="text"
          placeholder="Digite sua rua"
          register={register}
          validation={{ required: "A rua é obrigatória" }}
          error={errors.rua?.message}
        />
        <InputField
          label="Bairro*"
          name="bairro"
          type="text"
          placeholder="Digite seu bairro"
          register={register}
          validation={{ required: "O bairro é obrigatório" }}
          error={errors.bairro?.message}
        />
        <InputField
          label="Número*"
          name="numero"
          type="text"
          placeholder="Digite o número"
          register={register}
          validation={{ required: "O número é obrigatório" }}
          error={errors.numero?.message}
        />
        <InputField
          label="Complemento"
          name="complemento"
          type="text"
          placeholder="Digite o complemento"
          register={register}
          validation={{}}
          error={errors.complemento?.message}
        />
        <InputField
          label="Cidade*"
          name="cidade"
          type="text"
          placeholder="Digite sua cidade"
          register={register}
          validation={{ required: "A cidade é obrigatória" }}
          error={errors.cidade?.message}
        />
        <InputField
          label="Estado*"
          name="estado"
          type="text"
          placeholder="Digite seu estado"
          register={register}
          validation={{ required: "O estado é obrigatório" }}
          error={errors.estado?.message}
        />
      </div>
      <h2 className="text-black font-medium text-[22px] py-4">Cursos</h2>
      <AlunoCursosList cursos={cursos} register={register} errors={errors} />
    </form>
  );
};
