import { useEffect, useState } from "react";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { FiTrash2 } from "react-icons/fi";
import check from "../assets/img/Check.png";
import { createMatricula, updateMatricula, deleteMatricula } from "../services/aluno-curso";
import { getAlunoById } from "../services/aluno";
import { toast } from "react-hot-toast";

export const AlunoCursosManager = ({ alunoId, cursos, isCreateMode = false }) => {
  const [cursosMatriculados, setCursosMatriculados] = useState([]);
  const [cursosPendentes, setCursosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleRemoveCurso = async (cursoId, matriculaId) => {
    if (isCreateMode) {
      setCursosPendentes(cursosPendentes.filter(c => c.id !== cursoId));
      toast.success("Curso removido!");
      return;
    }

    if (!window.confirm("Deseja realmente remover este curso?")) {
      return;
    }

    try {
      await deleteMatricula(matriculaId);
      setCursosMatriculados(cursosMatriculados.filter(c => c.matriculaId !== matriculaId));
      toast.success("Matrícula removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover:", error);
      toast.error("Erro ao remover matrícula. Tente novamente.");
    }
  };

  if (loading && !isCreateMode) {
    return <p className="text-gray-medium">Carregando cursos...</p>;
  }

  const todosCursos = isCreateMode ? cursosPendentes : cursosMatriculados;

  return (
    <>
      <h2 className="text-black font-medium text-[22px] py-4">Cursos</h2>

      {todosCursos.length > 0 && (
        <div className="flex flex-col gap-4 w-full mb-[26px]">
          {todosCursos.map((curso, index) => (
            <div key={curso.matriculaId || curso.id || index} className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 md:flex-3 relative">
                <select
                  disabled
                  className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input appearance-none bg-white"
                >
                  <option>{curso.nome}</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveCurso(curso.id, curso.matriculaId)}
                  className="flex items-center justify-center text-primary cursor-pointer absolute right-3 top-2.5 center"
                  style={{ width: "30px", height: "30px" }}
                  title="Remover curso"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1 relative">
                  <input
                    type="date"
                    defaultValue={curso.dataConclusao || ""}
                    onChange={(e) => {
                      if (!isCreateMode) {
                        handleUpdateCurso(
                          curso.matriculaId,
                          curso.id,
                          e.target.value
                        );
                      }
                    }}
                    disabled={isCreateMode}
                    className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center" style={{ width: "30px", height: "30px" }}>
                    <img className="w-6 h-6" src={check} alt="Check" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">
        <div className="flex-1 md:flex-3">
          <label className="text-sm font-medium text-neutral-black" htmlFor="curso">
            Curso
          </label>
          <select
            id="curso"
            name="curso"
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
            className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
            disabled={submitting}
          >
            <option value="">Selecione uma opção</option>
            {cursos
              .filter(c => !todosCursos.some(cm => cm.id === c.id))
              .map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))
            }
          </select>
        </div>

        <div className="flex items-end gap-4 flex-1">
          <div className="flex-1">
            <label className="text-sm font-medium text-neutral-black" htmlFor="dataConclusao">
              Data de Conclusão
            </label>
            <input
              type="date"
              id="dataConclusao"
              name="dataConclusao"
              value={dataConclusao}
              onChange={(e) => setDataConclusao(e.target.value)}
              className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
              disabled={submitting}
            />
          </div>

          <button
            type="button"
            onClick={handleAddCurso}
            disabled={submitting}
            className="flex items-center justify-center cursor-pointer disabled:opacity-50"
            style={{ height: "30px", width: "30px" }}
          >
            <LiaPlusCircleSolid className="w-full h-full -mt-5" />
          </button>
        </div>
      </div>
    </>
  );
};
