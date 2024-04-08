// components/EditCourse.tsx
import React, { useState, useEffect } from "react";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import "./EditCourse.css";

interface Course {
  courseId: number;
  instructorName: string;
  courseName: string;
  tags: Tag[];
  students: EnrolledStudent[];
}

interface EnrolledStudent {
  name: string;
  isSelected: boolean;
}

interface EnrolledListResponse {
  enrolledList: EnrolledStudent[];
}

interface Tag {
  name: string;
  isSelected: boolean;
}

interface Courses {
  courses: Course[];
}

const EditCourse: React.FC = () => {
  const [courses, setCourses] = useState<Courses | null>(null);
  const [course, setCourse] = useState<Course>({
    courseId: 0,
    instructorName: "",
    courseName: "",
    tags: [],
    students: [],
  });
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [
          courseResponse,
          tagsResponse,
          studentsResponse,
        ] = await Promise.all([
          axios.get(
            `https://raw.githubusercontent.com/thedevelopers-co-in/dummy-api/main/course.json`
          ),
          axios.get(
            `https://raw.githubusercontent.com/thedevelopers-co-in/dummy-api/main/tags.json`
          ),
          axios.get<EnrolledListResponse>(
            `https://raw.githubusercontent.com/thedevelopers-co-in/dummy-api/main/students.json`
          ),
        ]);
        setCourses(courseResponse.data);
        const TagList = tagsResponse.data;
        setTags(
          TagList.tags.map((tag: string) => ({
            name: tag,
            isSelected: false,
          }))
        );
        const studentList = studentsResponse.data.enrolledList;
        setStudents(
          studentList.map((student) => ({ ...student, isSelected: false }))
        );
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCourse = {
      ...course,
      tags: tags.filter((tag) => tag.isSelected).map((tag) => tag.name),
      students: students
        .filter((student) => student.isSelected)
        .map((student) => student.name),
    };
    console.log("Updated course:", updatedCourse);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!courses) {
    return <div>Course not found</div>;
  }

  return (
    <div className="edit-course-details">
      <h2>Edit Course Details</h2>
      <form>
        <div className="form-group">
          <TextField
            className="text-field"
            id="text"
            label="Name"
            value={course?.courseName}
            onChange={(e) =>
              setCourse({ ...course, courseName: e.target.value })
            }
            margin="normal"
          />
        </div>
        <div className="form-group">
          <TextField
            id="text"
            className="text-field"
            label="Instructor"
            value={course?.instructorName}
            onChange={(e) =>
              setCourse({ ...course, instructorName: e.target.value })
            }
            margin="normal"
          />
        </div>
        <div className="form-checkbox">
          <TextField
            id="text"
            title="Tags"
            className="text-field"
            inputMode="text"
            value={tags
              .filter((tag) => tag.isSelected)
              .map((tag) => tag.name)
              .join(", ")}
            margin="normal"
          />
          <br />
          {tags.map((tag) => (
            <label key={tag.name}>
              <input
                type="checkbox"
                name={tag.name}
                checked={tag.isSelected}
                onChange={(e) =>
                  setTags(
                    tags.map((t) =>
                      t.name === tag.name
                        ? { ...t, isSelected: e.target.checked }
                        : t
                    )
                  )
                }
              />
              {tag.name}
            </label>
          ))}
        </div>

        <div className="form-checkbox">
          <TextField
            id="text"
            title="Students"
            className="text-field"
            inputMode="text"
            value={students
              .filter((student) => student.isSelected)
              .map((student) => student.name)
              .join(", ")}
            margin="normal"
          />
          <br />
          {students.map((student) => (
            <label key={student.name}>
              <input
                type="checkbox"
                name={student.name}
                checked={student.isSelected}
                onChange={(e) =>
                  setStudents(
                    students.map((s) =>
                      s.name === student.name
                        ? { ...s, isSelected: e.target.checked }
                        : s
                    )
                  )
                }
              />
              {student.name}
            </label>
          ))}
        </div>

        <div className="form-button">
          <button type="submit" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
