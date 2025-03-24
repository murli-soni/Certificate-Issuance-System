import React from 'react';

const InputField = ({ 
    label, 
    type = 'text', 
    name, 
    register, 
    errors, 
    validation, 
    ...rest 
}) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type={type ? type : "number"}
                className={`w-full p-2 border rounded-md ${errors?.[name] ? 'border-red-500' : 'border-gray-300'}`}
                {...register(name, validation)}
                {...rest}
            />
            {errors?.[name] && (
                <p className="text-red-500 text-xs mt-1">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};

export default InputField;
