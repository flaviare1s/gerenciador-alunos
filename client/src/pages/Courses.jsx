import { useState, useEffect } from "react";
import { CourseList } from "../components/CourseList";
import { SearchBar } from "../components/SearchBar";
import { getAllCourses } from "../services/course";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const filteredCourses = search
    ? courses.filter((course) =>
      [course.name, course.category].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
    : courses;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <SearchBar
        items={courses}
        setSearch={setSearch}
        search={search}
        type="course"
      />
      <CourseList
        filteredItems={filteredCourses}
        setItems={setCourses}
      />
    </div>
  );
};
