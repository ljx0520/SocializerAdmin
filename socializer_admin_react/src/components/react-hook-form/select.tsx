import React from "react";
import {useFormContext} from "react-hook-form";

export interface OptionProps {
    key: any;
    value: any;
    unavailable: boolean;
}

export type SelectProps = {
    id: string;
    name: string;
    options: OptionProps[];
    width?: string;
    rules?: Record<string, any>;
    placeholder?: string;
    onChange?: Function;
};

export const Select: React.FC<SelectProps> = ({
                                                  id,
                                                  name,
                                                  options,
                                                  rules = {},
                                                  width = "w-full",
                                                  placeholder, onChange
                                              }) => {
    const {register} = useFormContext();
    return (
        <select
            {...register(name, rules)}
            id={id}
            name={name}
            onChange={(e) => onChange && onChange(e)}
            className={`block ${width} border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 form-select focus:ring-blue-500 focus:border-blue-500 focus:ring-0 sm:text-sm rounded-md`}>
            {placeholder !== undefined ? <option value="">{placeholder}</option> : <></>}
            {options.map((option) => (
                <option key={option.key} value={option.key} disabled={option.unavailable}>
                    {option.value}
                </option>
            ))}
        </select>
    );
};
