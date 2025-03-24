import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Award } from 'lucide-react';
import CoursesContext from './context/CoursesContext';
import AddEditCourse from './components/AddEditCourse';
import { isEmpty } from 'lodash';

const CourseList = () => {
    const {
        courses,
        deleteCourse,
        handleShowCourse,
        showModal
    } = useContext(CoursesContext);

    return (
        <div>
            <div className='text-right'>
                <button
                    className='px-3 md:px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700'
                    onClick={() => handleShowCourse()}
                >
                    Add Course
                </button>
            </div>

            <div className="bg-white rounded-lg border border-2 mt-5 md:p-6 p-3">
                <h2 className="text-lg md:text-2xl mb-4 font-bold text-gray-800">Created Courses</h2>

                <div className="overflow-x-auto">
                        <table className="min-w-full bg-white w-[800px]">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 md:py-3 px-4 text-left">Candidate</th>
                                    <th className="py-2 md:py-3 px-4 text-left">Course</th>
                                    <th className="py-2 md:py-3 px-4 text-left">Course ID</th>
                                    <th className="py-2 md:py-3 px-4 text-left">Tenure Dates</th>
                                    <th className="py-2 md:py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-t">
                                        <td className="py-2 md:py-3 px-4">{course?.candidateName}</td>
                                        <td className="py-2 md:py-3 px-4">{course?.courseName}</td>
                                        <td className="py-2 md:py-3 px-4">{course?.courseId}</td>
                                        <td className="py-2 md:py-3 px-4">
                                            {new Date(course?.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 md:py-3 px-4 flex items-center space-x-2">
                                            <button
                                                onClick={() => handleShowCourse(course)}
                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                title="Edit course"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => deleteCourse(course?.id)}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                title="Delete course"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            <Link
                                                to={`/edit/${course?.id}`}
                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                title="Create certificate"
                                            >
                                                <Award size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isEmpty(courses) && <p className='text-center pt-4'>No record found</p>}

            </div>

            {showModal && <AddEditCourse />}
        </div>
    );
};

export default CourseList;
