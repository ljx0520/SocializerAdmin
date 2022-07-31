import React from "react";
import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import request from "lib";
import {notify} from "lib/notify";
import {useRouter} from "next/router";
import {trackPromise} from "react-promise-tracker";
import md5 from "md5";

export type FormProps = {
    username: string;
    password: string;
};

const Index: React.FC = () => {
    const router = useRouter();
    const methods = useForm<FormProps>({
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;

    const onSubmit = async (data: FormProps) => {
        await trackPromise(
            request
            .post('/api/user/login', {
                username: data.username,
                password: md5(data.password)
            })
            .then((res: any) => {
                if (res.data.code === 200) {
                    router.push('/');
                    // notify(res.data.msg, "success")
                } else {
                    notify(res.data.msg, "warn")
                }
            }));
    };

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
                            <InputWrapper outerClassName="sm:col-span-12">
                                <Label id="email">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    rules={{required: "Please enter a username"}}
                                />
                                {errors?.username?.message && (
                                    <ErrorMessage>{errors.username.message}</ErrorMessage>
                                )}
                            </InputWrapper>

                            <InputWrapper outerClassName="sm:col-span-12">
                                <Label id="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    rules={{
                                        required: "Please enter a password",
                                    }}
                                />
                                {errors?.password?.message && (
                                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                                )}
                            </InputWrapper>
                        </div>
                    </div>

                    <div className="flex justify-start space-x-2">
                        <button
                            onClick={() => {
                                reset();
                            }}
                            type="button"
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Submit
                        </button>
                    </div>
                </form>
            </FormProvider>
        </>

    );
};
export default Index;
