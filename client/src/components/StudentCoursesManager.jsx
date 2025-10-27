import { useEffect, useState } from "react";
import { updateEnrollment, deleteEnrollment, createEnrollment } from "../services/enrollment";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { StudentCourse } from "./StudentCourse";
import { Enrollment } from "./Enrollment";
import { getStudentById } from "../services/student";

export const StudentCoursesManager = ({ studentId, courses, isCreateMode = false }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [completionDate, setcompletionDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [courseToDelete, setcourseToDelete] = useState(null);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      getStudentById(studentId)
        .then((data) => {
          setEnrolledCourses(data.courses || []);
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
  }, [studentId]);

  const handleAddCourse = async () => {
    if (!selectedCourse) {
      toast.error("Selecione um curso");
      return;
    }

    if (isCreateMode) {
      const novocourse = courses.find(c => c.id === parseInt(selectedCourse));

      if (novocourse) {
        setPendingCourses([
          ...pendingCourses,
          {
            id: novocourse.id,
            name: novocourse.name,
            completionDate: completionDate || null
          }
        ]);

        setSelectedCourse("");
        setcompletionDate("");
        toast.success("Curso adicionado! Salve o aluno para confirmar a matrícula.");
      }
      return;
    }

    const payload = {
      studentId: parseInt(studentId),
      courseId: parseInt(selectedCourse),
      completionDate: completionDate || null
    };

    setSubmitting(true);

    try {
      const result = await createEnrollment(payload);

      const novocourse = courses.find(c => c.id === parseInt(selectedCourse));

      if (novocourse) {
        setEnrolledCourses([
          ...enrolledCourses,
          {
            id: novocourse.id,
            matriculaId: result.id,
            name: novocourse.name,
            completionDate: completionDate || null
          }
        ]);
      }

      setSelectedCourse("");
      setcompletionDate("");
      toast.success("student matriculado com sucesso!");
    } catch (error) {
      console.error("Erro ao matricular:", error);
      toast.error("Erro ao matricular aluno. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (matriculaId, courseId, novaData) => {
    if (!matriculaId) {
      toast.error("Erro ao atualizar matrícula: ID da matrícula não encontrado.");
      return;
    }

    try {
      await updateEnrollment(matriculaId, {
        studentId: parseInt(studentId),
        courseId: courseId,
        completionDate: novaData || null,
      });

      setEnrolledCourses(
        enrolledCourses.map((c) =>
          c.matriculaId === matriculaId
            ? { ...c, completionDate: novaData }
            : c
        )
      );

      toast.success("Data de conclusão atualizada!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar data de conclusão.");
    }
  };

  const handleRemoveCourse = (courseId) => {
    setcourseToDelete(courseId);
    setModalOpen(true);
  };

  const confirmRemoveCourse = async () => {
    if (courseToDelete) {
      try {
        if (isCreateMode) {
          setPendingCourses(pendingCourses.filter(c => c.id !== courseToDelete));
          toast.success("Curso removido!");
        } else {
          await deleteEnrollment(courseToDelete);
          setEnrolledCourses(enrolledCourses.filter(c => c.matriculaId !== courseToDelete));
          toast.success("Matrícula removida com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao remover:", error);
        toast.error("Erro ao remover matrícula. Tente novamente.");
      } finally {
        setModalOpen(false);
        setcourseToDelete(null);
      }
    }
  };

  if (loading && !isCreateMode) {
    return <p className="text-gray-medium">Carregando courses...</p>;
  }

  const allCourses = isCreateMode ? pendingCourses : enrolledCourses;

  return (
    <>
      <h2 className="text-black font-medium text-[22px] py-4">Cursos</h2>

      <StudentCourse
        allCourses={allCourses}
        handleRemoveCourse={handleRemoveCourse}
        handleUpdateCourse={handleUpdateCourse}
        isCreateMode={isCreateMode}
      />

      <Enrollment
        allCourses={allCourses}
        courses={courses}
        setSelectedCourse={setSelectedCourse}
        setcompletionDate={setcompletionDate}
        submitting={submitting}
        selectedCourse={selectedCourse}
        completionDate={completionDate}
        handleAddCourse={handleAddCourse}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmRemoveCourse}
      />
    </>
  );
};
