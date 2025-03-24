import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TiDelete } from "react-icons/ti";
import CoursesContext from '../context/CoursesContext';
import InputField from '../reusuableComponents/InputField';
import TextAreaField from '../reusuableComponents/TextAreaField';

const AddEditCourse = () => {
    const {
        addCourse,
        updateCourse,
        handleShowCourse,
        editingCourse
    } = useContext(CoursesContext);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const submitHandler = (data) => {
        if (editingCourse) {
            updateCourse({ ...data, id: editingCourse.id });
            toast.success('Course updated successfully!');
        } else {
            addCourse(data);
            toast.success('Course created successfully!');
        }

        handleShowCourse();
        reset();
    };

    useEffect(() => {
        if (editingCourse) {
            reset(editingCourse);
        }
    }, [editingCourse]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:flex items-center justify-center">
            <div className="bg-white md:rounded-lg shadow-md p-3 md:p-6 mb-8">
                <h2 className="items-center text-lg md:text-2xl mb-6 font-bold text-gray-800 flex justify-between">
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                    <TiDelete onClick={handleShowCourse} className='cursor-pointer text-3xl' />
                </h2>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InputField
                            label="Candidate Name"
                            name="candidateName"
                            register={register}
                            errors={errors}
                            validation={{ required: 'Candidate name is required' }}
                        />

                        <InputField
                            label="Course Name"
                            name="courseName"
                            register={register}
                            errors={errors}
                            validation={{ required: 'Course name is required' }}
                        />

                        <InputField
                            label="Course ID"
                            name="courseId"
                            type="text"
                            register={register}
                            errors={errors}
                            validation={{
                                required: 'Course ID is required',
                            }}
                            onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                        />

                        <InputField
                            label="Start Date"
                            type="date"
                            name="startDate"
                            register={register}
                            errors={errors}
                            validation={{ required: 'Start date is required' }}
                        />

                        <InputField
                            label="End Date"
                            type="date"
                            name="endDate"
                            register={register}
                            errors={errors}
                            validation={{ required: 'End date is required' }}
                        />
                    </div>

                    <div>
                    <TextAreaField
                        label="Description"
                        name="description"
                        register={register}
                        errors={errors}
                        validation={{ required: 'Description is required' }}
                    />
                    </div>

                    <div className='text-center'>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {editingCourse ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditCourse;
