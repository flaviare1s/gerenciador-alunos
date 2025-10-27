import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { InputField } from "../components/InputField";
import { createCourse, getCourseById, updateCourse } from "../services/course";

export const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getCourseById(id)
        .then((course) => {
          setValue("name", course.name || "");
        })
        .catch(() => {
          toast.error("Erro ao carregar curso");
        })
        .finally(() => setLoading(false));
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await updateCourse(id, data);
        toast.success("Curso atualizado com sucesso!");
      } else {
        await createCourse(data);
        toast.success("Curso criado com sucesso!");
      }
      navigate("/cursos");
    } catch {
      toast.error("Erro ao salvar curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md mt-6">
      <h1 className="text-xl font-semibold mb-6">
        {id ? "Editar Curso" : "Cadastrar Curso"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="Nome do curso"
          name="name"
          placeholder="Digite o nome do curso"
          register={register}
          validation={{ required: "O nome é obrigatório" }}
          error={errors.name?.message}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {loading ? "Salvando..." : id ? "Atualizar Curso" : "Cadastrar Curso"}
        </button>
      </form>
    </div>
  );
};
