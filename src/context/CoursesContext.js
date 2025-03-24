import React, { createContext, useState, useEffect } from 'react';

const CoursesContext = createContext();
export default CoursesContext;

export const CoursesProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null); 

    useEffect(() => {
        const savedCourses = localStorage.getItem('courses');
        if (savedCourses) setCourses(JSON.parse(savedCourses));
    }, []);

    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    // Add Course
    const addCourse = (course) => {
        setCourses([...courses, { ...course, id: Date.now().toString() }]);
    };

    // Update Course
    const updateCourse = (updatedCourse) => {
        setCourses(courses.map(course =>
            course.id === updatedCourse.id ? updatedCourse : course
        ));
    };

    // Delete Course
    const deleteCourse = (id) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    // Toggle Modal
    const handleShowCourse = (course = null) => {
        setShowModal(!showModal);
        setEditingCourse(course); 
    };

    return (
        <CoursesContext.Provider value={{
            courses,
            addCourse,
            updateCourse,
            deleteCourse,
            showModal,
            handleShowCourse,
            editingCourse,
        }}>
            {children}
        </CoursesContext.Provider>
    );
};
