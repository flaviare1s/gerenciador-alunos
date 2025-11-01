import { IoClose } from "react-icons/io5"

export const CoursesModal = ({ student, setCoursesModalOpen }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setCoursesModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-neutral-black">
            {student.firstName} {student.lastName}
          </h3>
          <button
            onClick={() => setCoursesModalOpen(false)}
            className="text-dark-gray hover:text-neutral-black transition-colors"
          >
            <IoClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <ul className="flex flex-wrap gap-2">
            {student.courses.map((course, index) => (
              <li
                key={index}
                className="text-xs bg-bg-badge text-secondary px-3 py-1 rounded-full font-medium border border-light-blue"
              >
                {course}
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-dark-gray">
              Total: <span className="font-medium text-neutral-black">{student.courses.length}</span> {student.courses.length === 1 ? 'curso' : 'cursos'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
