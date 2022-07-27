import {useRouter} from "next/router";
import {trackPromise} from "react-promise-tracker";
import ReactTimeago from "react-timeago";
import request from "../../service/fetch";
import {formatDate, IPage} from "../../lib";
import {notify} from "../../utils/notify";
import {ChangeEvent, useEffect, useState} from "react";
import SectionTitle from "../../components/section-title";
import {Dispute} from "../disputes";
import {OptionProps, Select} from "components/react-hook-form/select";
import Widget from "../../components/widget";
import {Badge} from "../../components/badges";
import Dropdown from "../../components/dropdowns";
import {DefaultTabs} from "../../components/tabs";
import {FormProvider, useForm} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "../../components/react-hook-form/label";
import {ErrorMessage} from "../../components/react-hook-form/error-message";
import {Textarea} from "../../components/react-hook-form/textarea";
import {FiSend} from "react-icons/fi";

export type DisputeFormProps = {
    dispute_status: string;
    dispute_result: string;
    dispute_notes: string;
};

const Tab0 = (props: Dispute) => {
    const [currentStatus, setCurrentStatus] = useState(() => props.dispute_status)

    const methods = useForm<DisputeFormProps>({
        defaultValues: {
            dispute_status: props.dispute_status,
            dispute_result: props.dispute_result,
            dispute_notes: props.dispute_notes,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
        getValues,
        register,
        unregister
    } = methods;

    const onSubmit = (data: DisputeFormProps) => {
        //eslint-disable-next-line
        console.log(JSON.stringify(data, null, 2));
    };

    const onStatusChange = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setCurrentStatus(target.value)
    };

    var disputeStatusOptions: OptionProps[] = []
    switch (props.dispute_status) {
        case "Submitted":
            disputeStatusOptions = [
                {key: "Submitted", value: "Submitted", unavailable: false},
                {key: "Processing", value: "Processing", unavailable: false},
                {key: "Resolved", value: "Resolved", unavailable: false},
            ];
            break;
        case "Processing":
            disputeStatusOptions = [
                {key: "Processing", value: "Processing", unavailable: false},
                {key: "Resolved", value: "Resolved", unavailable: false},
            ];
            break;
        case "Resolved":
            disputeStatusOptions = [
                {key: "Resolved", value: "Resolved", unavailable: false},
            ];
            break;
    }

    useEffect(() => {
        console.log('current status ', currentStatus)
        if (currentStatus !== "Resolved") {
            console.log("unregister");
            register("dispute_result", {required: false});
            register("dispute_notes", {required: false});
        } else {
            console.log("register");
            register("dispute_result", {required: "This is required"});
            register("dispute_notes", {required: "This is required"});
        }
    }, [currentStatus]);

    return <>
        <Widget>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Dispute Object"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{props.dispute_object}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Dispute Type"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{props.dispute_type}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Dispute Reason"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{props.dispute_reason}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Created At"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{formatDate(props.created_at)} (<ReactTimeago date={props.created_at}/>)
                        </div>
                    </div>
                </div>
            </div>
            {
                props.dispute_status !== "Submitted" ? <div className="flex flex-wrap mb-3">
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm font-bold">{"Processed At"}</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm">{formatDate(props.dispute_processed_at)}</div>
                        </div>
                    </div>
                </div> : null
            }
            {
                props.dispute_status === "Resolved" ? <div className="flex flex-wrap mb-3">
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm font-bold">{"Resolved At"}</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm">{formatDate(props.dispute_resolved_at)}</div>
                        </div>
                    </div>
                </div> : null
            }
        </Widget>
        <Widget description={"Notes"}>
            {
                props.notes.length == 0 ?
                    <div className="text-sm">There isn't any notes</div>
                    :
                    props.notes.map((note) => <>
                        <div className="flex flex-col lg:flex-row mb-3">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm font-bold">{note.host_or_guest == "Guest" ? "User" : "Socializer"}</div>
                                <div className="text-sm">{note.note}</div>
                            </div>
                            <div className="shrink-0">
                                <div className="text-gray-500 lg:ml-1">{formatDate(note.sent_at)} (<ReactTimeago
                                    date={note.sent_at}/>)
                                </div>
                            </div>
                        </div>
                    </>)

            }
            <div className="flex items-center space-x-4 justify-items-start mt-3">
                <input
                    name="note"
                    type="text"
                    className="w-full h-10 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full appearance-none focus:outline-none form-input"
                    placeholder="Add a Note"
                />
                <div className="flex flex-row items-center justify-end shrink-0 space-x-2">
                    <button
                        className="inline-flex items-center justify-center w-8 h-8 p-0 text-xs font-bold uppercase rounded-full">
                        <FiSend size={18} className="stroke-current"/>
                    </button>
                </div>
            </div>
        </Widget>
        <Widget>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-12">
                            <InputWrapper outerClassName="sm:col-span-4">
                                <Label id="select">Dispute Status</Label>
                                <Select
                                    id="dispute_status"
                                    name="dispute_status"
                                    rules={{required: "This is required"}}
                                    onChange={onStatusChange}
                                    options={[
                                        ...disputeStatusOptions
                                    ]}/>
                                {errors?.dispute_status?.message && (
                                    <ErrorMessage>{errors.dispute_status.message}</ErrorMessage>
                                )}
                            </InputWrapper>
                        </div>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-12">
                            <InputWrapper outerClassName="sm:col-span-6">
                                <Label id="textarea">Dispute Result</Label>
                                <Textarea
                                    id="dispute_result"
                                    name="dispute_result"
                                />
                                {errors?.dispute_result?.message && (
                                    <ErrorMessage>{errors.dispute_result.message}</ErrorMessage>
                                )}
                            </InputWrapper>
                            <InputWrapper outerClassName="sm:col-span-6">
                                <Label id="textarea">Dispute Notes (Internal Only)</Label>
                                <Textarea
                                    id="dispute_notes"
                                    name="dispute_notes"
                                />
                                {errors?.dispute_notes?.message && (
                                    <ErrorMessage>{errors.dispute_notes.message}</ErrorMessage>
                                )}
                            </InputWrapper>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                reset();
                            }}
                            type="button"
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Update
                        </button>
                    </div>
                </form>
            </FormProvider>
        </Widget>
    </>
}

const Tab1 = () => {
    return <></>
}

export default function Index() {
    const router = useRouter();
    const {id} = router.query;
    const [data, setData] = useState<Dispute | null>(() => null)
    const [currentStatus, setCurrentStatus] = useState<string | null>(() => null)

    const getDispute = () => {
        trackPromise(
            request
                .get(`/api/disputes/${id}`)
                .then((res: any) => {
                    if (res.data.code === 200) {
                        var data = res.data.data;
                        // console.log(data)
                        setData(data);
                        setCurrentStatus(data.dispute_status);
                    } else {
                        notify(res.data.msg, "warn")
                    }
                }));
    }

    useEffect(() => {
        return () => {
            getDispute();
        }
    }, [])

    return (
        data != null ? <>
            <SectionTitle title="Reports & Requests" subtitle={data.id}
                          right={<>
                              {
                                  data.dispute_status == "Submitted" ?
                                      <Badge key={data.id} size="lg" color="bg-blue-500 text-white" rounded>
                                          {data.dispute_status}
                                      </Badge> : data.dispute_status == "Processing" ?
                                          <Badge key={data.id} size="lg" color="bg-green-500 text-white" rounded>
                                              {data.dispute_status}
                                          </Badge> :
                                          <Badge key={data.id} size="lg" color="bg-slate-500 text-white" rounded>
                                              {data.dispute_status}
                                          </Badge>
                              }
                          </>}/>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <DefaultTabs tabs={
                        [{index: 0, title: "Dispute Info", active: true, content: <Tab0 {...data}/>},
                            {index: 1, title: "User Profile", active: false, content: <Tab1/>},]
                    }/>
                </div>
            </div>

        </> : <>Not Found</>
    )

}
