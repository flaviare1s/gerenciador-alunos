import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import { toast } from "react-hot-toast";
import { getAllCursos } from "../services/course";
import { getAlunoById, createAluno, deleteAluno } from "../services/student";
import { StudentCoursesManager } from "../components/StudentCoursesManager";
import { usePage } from "../contexts/PageContext";
import { alunoSchema } from "../schemas/studentSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export const StudentForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(alunoSchema)
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPageData } = usePage();
  const [cursos, setCursos] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const cep = watch("cep");

  useEffect(() => {
    if (id) {
      setIsUpdateMode(true);
      const fetchAluno = async () => {
        try {
          const aluno = await getAlunoById(id);
          Object.keys(aluno).forEach((key) => setValue(key, aluno[key]));

          setPageData({
            title: "Gerenciador de alunos",
            subtitle: `${aluno.nome} ${aluno.sobrenome}`,
            onDelete: async () => {
              await deleteAluno(id);
              toast.success("Aluno deletado com sucesso!");
              navigate("/");
            },
          });
        } catch {
          toast.error("Não foi possível carregar os dados do aluno.");
        }
      };
      fetchAluno();
    } else {
      setPageData({
        title: "Gerenciador de alunos",
        subtitle: "",
        onDelete: null,
      });
    }
  }, [id, setValue, setPageData, navigate]);

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

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento).toISOString() : null
      };
      await createAluno(payload);
      toast.success("Aluno cadastrado com sucesso!");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      toast.error("Erro ao cadastrar aluno. Verifique os dados.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto">
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
        <InputField label="CEP*" name="cep" type="text" placeholder="Digite seu CEP" register={register} validation={{ required: "O CEP é obrigatório" }} error={errors.cep?.message} />
        <InputField label="País*" name="pais" type="text" placeholder="Digite seu país" register={register} validation={{ required: "O país é obrigatório" }} error={errors.pais?.message} />
        <InputField label="Rua*" name="rua" type="text" placeholder="Digite sua rua" register={register} validation={{ required: "A rua é obrigatória" }} error={errors.rua?.message} />
        <InputField label="Bairro*" name="bairro" type="text" placeholder="Digite seu bairro" register={register} validation={{ required: "O bairro é obrigatório" }} error={errors.bairro?.message} />
        <InputField label="Número*" name="numero" type="text" placeholder="Digite o número" register={register} validation={{ required: "O número é obrigatório" }} error={errors.numero?.message} />
        <InputField label="Complemento" name="complemento" type="text" placeholder="Digite o complemento" register={register} error={errors.complemento?.message} />
        <InputField label="Cidade*" name="cidade" type="text" placeholder="Digite sua cidade" register={register} validation={{ required: "A cidade é obrigatória" }} error={errors.cidade?.message} />
        <InputField label="Estado*" name="estado" type="text" placeholder="Digite seu estado" register={register} validation={{ required: "O estado é obrigatório" }} error={errors.estado?.message} />
      </div>

      <StudentCoursesManager alunoId={id} cursos={cursos} isCreateMode={!isUpdateMode} />

      {!isUpdateMode && (
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="text-white bg-primary hover:bg-primary/90 text-sm font-medium py-2 px-4 mt-2 rounded-md transition-colors cursor-pointer"
          >
            Cadastrar aluno
          </button>
        </div>
      )}
    </form>
  );
};
