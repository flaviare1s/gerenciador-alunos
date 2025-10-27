import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import { toast } from "react-hot-toast";
import { StudentCoursesManager } from "../components/StudentCoursesManager";
import { usePage } from "../contexts/PageContext";
import { studentSchema } from "../schemas/studentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudent, deleteStudent, getStudentById } from "../services/student";
import { getAllCourses } from "../services/course";
import { createEnrollment } from "../services/enrollment";

export const StudentForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(studentSchema)
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPageData } = usePage();
  const [allCourses, setAllCourses] = useState([]);
  const [_studentCourses, setStudentCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const cep = watch("zipCode");

  useEffect(() => {
    if (!id) return;

    setIsUpdateMode(true);

    const fetchStudent = async () => {
      try {
        const student = await getStudentById(id);

        Object.keys(student).forEach((key) => setValue(key, student[key]));

        const formattedCourses = student.enrollments?.map(enr => ({
          id: enr.courseId,
          matriculaId: enr.id,
          name: enr.courseName,
          completionDate: enr.completionDate || "",
          status: enr.status
        })) || [];

        setStudentCourses(formattedCourses);

        setPageData({
          title: "Gerenciador de alunos",
          subtitle: `${student.firstName} ${student.lastName}`,
          onDelete: async () => {
            await deleteStudent(id);
            toast.success("Aluno deletado com sucesso!");
            navigate("/");
          },
        });
      } catch {
        toast.error("Não foi possível carregar os dados do aluno.");
      }
    };

    fetchStudent();
  }, [id, setValue, setPageData, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setAllCourses(data);
      } catch {
        toast.error("Não foi possível carregar os cursos disponíveis.");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!cep || cep.length !== 8) return;

    const fetchAddress = async () => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setValue("street", data.logradouro);
          setValue("neighborhood", data.bairro);
          setValue("city", data.localidade);
          setValue("state", data.uf);
        }
      } catch {
        toast.error("Não foi possível buscar o endereço para o CEP informado.");
      }
    };

    fetchAddress();
  }, [cep, setValue]);

  const mapGenderToEnglish = { Masculino: "MALE", Feminino: "FEMALE", Outro: "OTHER" };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        gender: mapGenderToEnglish[data.gender] || "OTHER",
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
      };

      const createdStudent = await createStudent(payload);
      const studentId = createdStudent.id;

      for (const course of pendingCourses) {
        await createEnrollment({
          studentId,
          courseId: course.id,
          completionDate: course.completionDate || null,
        });
      }

      toast.success("Aluno cadastrado com sucesso!");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar aluno e cursos:", error);
      toast.error("Erro ao cadastrar aluno. Verifique os dados.");
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto">
      <div className="flex flex-col sm:flex-row gap-6 w-full mb-[26px]">
        <InputField
          label="Nome*"
          name="firstName"
          type="text"
          placeholder="Digite seu nome"
          register={register}
          validation={{ required: "O nome é obrigatório" }}
          error={errors.firstName?.message}
        />
        <InputField
          label="Sobrenome*"
          name="lastName"
          type="text"
          placeholder="Digite seu sobrenome"
          register={register}
          validation={{ required: "O sobrenome é obrigatório" }}
          error={errors.lastName?.message}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-[26px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <InputField
            label="Data de nascimento*"
            name="birthDate"
            type="date"
            register={register}
            error={errors.birthDate?.message}
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
        </div>

        <div className="flex flex-col w-full mt-0 sm:mt-1">
          <label htmlFor="gender" className="text-sm font-medium text-neutral-black">
            Gênero*
          </label>
          <select
            id="gender"
            name="gender"
            {...register("gender", { required: "O gênero é obrigatório" })}
            className="text-gray-medium bg-[#dbdbdb20] w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
          >
            <option value="">Selecione</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
            <option value="OTHER">Outro</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs mt-1">{errors.gender.message}</span>
          )}
        </div>
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
        <InputField label="CEP*" name="zipCode" type="text" placeholder="Digite seu CEP" register={register} validation={{ required: "O CEP é obrigatório" }} error={errors.zipCode?.message} />
        <InputField label="País*" name="country" type="text" placeholder="Digite seu país" register={register} validation={{ required: "O país é obrigatório" }} error={errors.country?.message} />
        <InputField label="street*" name="street" type="text" placeholder="Digite sua rua" register={register} validation={{ required: "A rua é obrigatória" }} error={errors.street?.message} />
        <InputField label="Bairro*" name="neighborhood" type="text" placeholder="Digite seu bairro" register={register} validation={{ required: "O bairro é obrigatório" }} error={errors.neighborhood?.message} />
        <InputField label="Número*" name="number" type="text" placeholder="Digite o número" register={register} validation={{ required: "O número é obrigatório" }} error={errors.number?.message} />
        <InputField label="Complemento" name="complement" type="text" placeholder="Digite o complemento" register={register} error={errors.complement?.message} />
        <InputField label="Cidade*" name="city" type="text" placeholder="Digite sua cidade" register={register} validation={{ required: "A cidade é obrigatória" }} error={errors.city?.message} />
        <InputField label="Estado*" name="state" type="text" placeholder="Digite seu estado" register={register} validation={{ required: "O estado é obrigatório" }} error={errors.state?.message} />
      </div>

      <StudentCoursesManager
        studentId={id}
        courses={allCourses}
        isCreateMode={!isUpdateMode}
        pendingCourses={pendingCourses}
        setPendingCourses={setPendingCourses}
      />

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
