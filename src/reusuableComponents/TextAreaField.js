import React from 'react';

const TextAreaField = ({ 
    label, 
    name, 
    register, 
    errors, 
    validation, 
    rows = 3, 
    ...rest 
}) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <textarea
                className={`w-full p-2 border rounded-md ${errors?.[name] ? 'border-red-500' : 'border-gray-300'}`}
                rows={rows}
                {...register(name, validation)}
                {...rest}
            ></textarea>
            {errors?.[name] && (
                <p className="text-red-500 text-xs mt-1">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};

export default TextAreaField;
