import { useEffect, useState } from "react";
import { updateEnrollment, deleteEnrollment, createEnrollment } from "../services/enrollment";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { StudentCourse } from "./StudentCourse";
import { Enrollment } from "./Enrollment";
import { getStudentById } from "../services/student";

export const StudentCoursesManager = ({ studentId, courses, isCreateMode = false, pendingCourses, setPendingCourses }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      getStudentById(studentId)
        .then((data) => {
          const formattedCourses = data.enrollments?.map(enrollment => ({
            id: enrollment.courseId,
            enrollmentId: enrollment.id,
            name: enrollment.course?.name || "Curso desconhecido",
            completionDate: enrollment.completionDate ? enrollment.completionDate.split('T')[0] : null,
            status: enrollment.status || "IN_PROGRESS"
          })) || [];

          setEnrolledCourses(formattedCourses);
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

    const newCourse = courses.find((c) => c.id === parseInt(selectedCourse));
    if (!newCourse) {
      toast.error("Curso não encontrado");
      return;
    }

    if (isCreateMode) {
      const alreadyAdded = pendingCourses.some((c) => c.id === parseInt(selectedCourse));
      if (alreadyAdded) {
        toast.error("Curso já adicionado!");
        return;
      }

      setPendingCourses((prevCourses) => [
        ...prevCourses,
        {
          id: newCourse.id,
          name: newCourse.name,
          completionDate: completionDate || null,
          status: completionDate ? "COMPLETED" : "IN_PROGRESS",
        },
      ]);

      setSelectedCourse("");
      setCompletionDate("");
      toast.success("Curso adicionado! Salve o aluno para confirmar a matrícula.");
      return;
    }

    setSubmitting(true);
    try {
      const completionDateISO = completionDate
        ? new Date(completionDate + 'T00:00:00').toISOString()
        : new Date().toISOString();

      const result = await createEnrollment({
        studentId: parseInt(studentId),
        courseId: parseInt(selectedCourse),
        completionDate: completionDateISO
      });

      setEnrolledCourses([
        ...enrolledCourses,
        {
          id: newCourse.id,
          enrollmentId: result.id,
          name: newCourse.name,
          completionDate: completionDate ? completionDate : null,
          status: result.status || "IN_PROGRESS"
        }
      ]);

      setSelectedCourse("");
      setCompletionDate("");
      toast.success("Matrícula criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar matrícula:", error);
      toast.error("Erro ao criar matrícula. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (enrollmentId, courseId, novaData) => {
    if (!enrollmentId) {
      toast.error("Erro ao atualizar matrícula: ID da matrícula não encontrado.");
      return;
    }

    const completionDateISO = novaData ? new Date(novaData + 'T00:00:00').toISOString() : null;

    const payload = {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
      completionDate: completionDateISO,
    };

    try {
      await updateEnrollment(enrollmentId, payload);

      setEnrolledCourses(
        enrolledCourses.map((c) =>
          c.enrollmentId === enrollmentId
            ? {
              ...c,
              completionDate: novaData,
              status: novaData ? "COMPLETED" : "IN_PROGRESS",
            }
            : c
        )
      );

      toast.success("Data de conclusão atualizada!");
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Response data:", error.response?.data);
      toast.error("Erro ao atualizar data de conclusão.");
    }
  };

  const handleRemoveCourse = (enrollmentId) => {
    setCourseToDelete(enrollmentId);
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
          setEnrolledCourses(enrolledCourses.filter(c => c.enrollmentId !== courseToDelete));
          toast.success("Matrícula removida com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao remover:", error);
        toast.error("Erro ao remover matrícula. Tente novamente.");
      } finally {
        setModalOpen(false);
        setCourseToDelete(null);
      }
    }
  };

  if (loading && !isCreateMode) {
    return <p className="text-gray-medium">Carregando cursos...</p>;
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
        setCompletionDate={setCompletionDate}
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
