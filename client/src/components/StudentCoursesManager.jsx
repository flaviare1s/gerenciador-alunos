import { useEffect, useState } from "react";
import { createMatricula, updateMatricula, deleteMatricula } from "../services/enrollment";
import { getAlunoById } from "../services/student";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { StudentCourse } from "./StudentCourse";
import { Enrollment } from "./Enrollment";

export const StudentCoursesManager = ({ alunoId, cursos, isCreateMode = false }) => {
  const [cursosMatriculados, setCursosMatriculados] = useState([]);
  const [cursosPendentes, setCursosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState(null);

  useEffect(() => {
    if (alunoId) {
      setLoading(true);
      getAlunoById(alunoId)
        .then((data) => {
          setCursosMatriculados(data.cursos || []);
        })
        .catch((error) => {
          console.error("Erro ao buscar cursos do aluno:", error);
          toast.error("Erro ao carregar cursos do aluno");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [alunoId]);

  const handleAddCurso = async () => {
    if (!cursoSelecionado) {
      toast.error("Selecione um curso");
      return;
    }

    if (isCreateMode) {
      const novoCurso = cursos.find(c => c.id === parseInt(cursoSelecionado));

      if (novoCurso) {
        setCursosPendentes([
          ...cursosPendentes,
          {
            id: novoCurso.id,
            nome: novoCurso.nome,
            dataConclusao: dataConclusao || null
          }
        ]);

        setCursoSelecionado("");
        setDataConclusao("");
        toast.success("Curso adicionado! Salve o aluno para confirmar a matrícula.");
      }
      return;
    }

    const payload = {
      alunoId: parseInt(alunoId),
      cursoId: parseInt(cursoSelecionado),
      dataConclusao: dataConclusao || null
    };

    setSubmitting(true);

    try {
      const result = await createMatricula(payload);

      const novoCurso = cursos.find(c => c.id === parseInt(cursoSelecionado));

      if (novoCurso) {
        setCursosMatriculados([
          ...cursosMatriculados,
          {
            id: novoCurso.id,
            matriculaId: result.id,
            nome: novoCurso.nome,
            dataConclusao: dataConclusao || null
          }
        ]);
      }

      setCursoSelecionado("");
      setDataConclusao("");
      toast.success("Aluno matriculado com sucesso!");
    } catch (error) {
      console.error("Erro ao matricular:", error);
      toast.error("Erro ao matricular aluno. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCurso = async (matriculaId, cursoId, novaData) => {
    if (!matriculaId) {
      console.error("matriculaId está indefinido. Não é possível atualizar a matrícula.");
      toast.error("Erro ao atualizar matrícula: ID da matrícula não encontrado.");
      return;
    }

    try {
      await updateMatricula(matriculaId, {
        alunoId: parseInt(alunoId),
        cursoId: cursoId,
        dataConclusao: novaData || null,
      });

      setCursosMatriculados(
        cursosMatriculados.map((c) =>
          c.matriculaId === matriculaId
            ? { ...c, dataConclusao: novaData }
            : c
        )
      );

      toast.success("Data de conclusão atualizada!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar data de conclusão.");
    }
  };

  const handleRemoveCurso = (cursoId) => {
    setCursoToDelete(cursoId);
    setModalOpen(true);
  };

  const confirmRemoveCurso = async () => {
    if (cursoToDelete) {
      try {
        if (isCreateMode) {
          setCursosPendentes(cursosPendentes.filter(c => c.id !== cursoToDelete));
          toast.success("Curso removido!");
        } else {
          await deleteMatricula(cursoToDelete);
          setCursosMatriculados(cursosMatriculados.filter(c => c.matriculaId !== cursoToDelete));
          toast.success("Matrícula removida com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao remover:", error);
        toast.error("Erro ao remover matrícula. Tente novamente.");
      } finally {
        setModalOpen(false);
        setCursoToDelete(null);
      }
    }
  };

  if (loading && !isCreateMode) {
    return <p className="text-gray-medium">Carregando cursos...</p>;
  }

  const todosCursos = isCreateMode ? cursosPendentes : cursosMatriculados;

  return (
    <>
      <h2 className="text-black font-medium text-[22px] py-4">Cursos</h2>

      <StudentCourse
        todosCursos={todosCursos}
        handleRemoveCurso={handleRemoveCurso}
        handleUpdateCurso={handleUpdateCurso}
        isCreateMode={isCreateMode}
      />

      <Enrollment
        todosCursos={todosCursos}
        cursos={cursos}
        setCursoSelecionado={setCursoSelecionado}
        setDataConclusao={setDataConclusao}
        submitting={submitting}
        cursoSelecionado={cursoSelecionado}
        dataConclusao={dataConclusao}
        handleAddCurso={handleAddCurso}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmRemoveCurso}
      />
    </>
  );
};
