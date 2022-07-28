import {useRouter} from "next/router";
import {trackPromise} from "react-promise-tracker";
import ReactTimeago from "react-timeago";
import request from "../../service/fetch";
import {formatDate, getAge, IMAGE_ROOT, IPage} from "../../lib";
import {notify} from "../../utils/notify";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import SectionTitle from "../../components/section-title";
import {OptionProps, Select} from "components/react-hook-form/select";
import Widget from "../../components/widget";
import {Badge} from "../../components/badges";
import Dropdown from "../../components/dropdowns";
import {DefaultTabs, TabProps, TabsProps} from "../../components/tabs";
import {FormProvider, useForm} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "../../components/react-hook-form/label";
import {ErrorMessage} from "../../components/react-hook-form/error-message";
import {Textarea} from "../../components/react-hook-form/textarea";
import {FiSend} from "react-icons/fi";
import {Dispute, Offer, Order, UserProfile} from "../../lib/types";
import ImageGallery from 'react-image-gallery';

export type DisputeFormProps = {
    dispute_status: string;
    dispute_result: string;
    dispute_notes: string;
    note: string;
};

export interface TabDisputeProps {
    dispute: Dispute;
    onUpdate: Function
}

export interface TabUserProfileProps {
    userProfile: UserProfile;
}

export interface TabOfferProps {
    offer: Offer;
}

export interface TabOrderProps {
    order: Order;
}

const TabDispute = ({dispute, onUpdate}: TabDisputeProps) => {
    const [currentStatus, setCurrentStatus] = useState(() => dispute.dispute_status)
    const [note, setNote] = useState(() => "")

    const methods = useForm<DisputeFormProps>({
        defaultValues: {
            dispute_status: dispute.dispute_status,
            dispute_result: dispute.dispute_result,
            dispute_notes: dispute.dispute_notes,
            note: "",
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

    const onStatusChange = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setCurrentStatus(target.value)
    };

    var disputeStatusOptions: OptionProps[] = []
    switch (dispute.dispute_status) {
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

    const onSubmit = async (formProps: DisputeFormProps) => {
        //eslint-disable-next-line
        console.log(JSON.stringify(formProps, null, 2));

        await onUpdate({
            dispute_status: formProps.dispute_status,
            dispute_notes: formProps.dispute_notes,
            dispute_result: formProps.dispute_result,
        });
    };

    const onSendNote = async () => {
        // e.preventDefault();
        console.log(note);
        if (note != "") {
            console.log(onUpdate)
            await onUpdate({
                dispute_status: dispute.dispute_status,
                dispute_notes: dispute.dispute_notes,
                dispute_result: dispute.dispute_result,
                note: note
            });
            setNote("")
        } else {
            notify("Please add a note", "warn")
        }

    };

    return <>
        <Widget>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Request Object"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{dispute.dispute_object}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Request Type"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{dispute.dispute_type}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Request Reason"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{dispute.dispute_reason}</div>
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
                        <div className="text-sm">{formatDate(dispute.created_at)} (<ReactTimeago
                            date={dispute.created_at}/>)
                        </div>
                    </div>
                </div>
            </div>
            {
                dispute.dispute_status !== "Submitted" ? <div className="flex flex-wrap mb-3">
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm font-bold">{"Processed At"}</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm">{formatDate(dispute.dispute_processed_at)}</div>
                        </div>
                    </div>
                </div> : null
            }
            {
                dispute.dispute_status === "Resolved" ? <div className="flex flex-wrap mb-3">
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm font-bold">{"Resolved At"}</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm">{formatDate(dispute.dispute_resolved_at)}</div>
                        </div>
                    </div>
                </div> : null
            }
        </Widget>
        <Widget description={"Notes"}>
            {
                dispute.notes.length == 0 ?
                    <div className="text-sm">There isn't any notes</div>
                    :
                    dispute.notes.map((note, index) =>
                        <div className="flex flex-col lg:flex-row mb-3" key={index}>
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
                    )

            }
            <div className="flex items-center space-x-4 justify-items-start mt-3">
                <input
                    id="note"
                    name="note"
                    type="text"
                    className="w-full h-10 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full appearance-none focus:outline-none form-input"
                    placeholder="Add a Note"
                    value={note}
                    onChange={(e) => {
                        setNote(e.target.value);
                    }
                    }
                />

                <div className="flex flex-row items-center justify-end shrink-0 space-x-2">
                    <button
                        className="inline-flex items-center justify-center w-8 h-8 p-0 text-xs font-bold uppercase rounded-full"
                        onClick={onSendNote}>
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
                                <Label id="select">Request Status</Label>
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
                                <Label id="textarea">Request Result</Label>
                                <Textarea
                                    id="dispute_result"
                                    name="dispute_result"
                                />
                                {errors?.dispute_result?.message && (
                                    <ErrorMessage>{errors.dispute_result.message}</ErrorMessage>
                                )}
                            </InputWrapper>
                            <InputWrapper outerClassName="sm:col-span-6">
                                <Label id="textarea">Request Notes (Internal Only)</Label>
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

const TabUserProfile = ({userProfile}: TabUserProfileProps) => {

    return <>
        <Widget description={"Basic Info"}>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"User Id"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{userProfile.user_id}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Username | Nickname | Gender"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.username} | {userProfile.nickname} | {userProfile.gender.length == 0 ? "NA" : userProfile.gender[0] == "" ? "NA" : userProfile.gender[0]}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Living Area"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.living_suburb}, {userProfile.living_state}, {userProfile.living_country} {userProfile.living_postal_code} ({userProfile.living_lat}, {userProfile.living_long})
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Dob (Age)"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.dob}, (Age {getAge(userProfile.dob)})
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Verified"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.is_verified.toString()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Pass Code"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.pass_code}
                        </div>
                    </div>
                </div>
            </div>
        </Widget>

        <Widget description={"Other Info"}>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Height"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.height == 0 ? "NA" : userProfile.height.toString()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Smoking"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.smoking == "" ? "NA" : userProfile.smoking}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Drinking"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.drinking == "" ? "NA" : userProfile.drinking}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"About Me"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.about_me === "" ? "NA" : userProfile.about_me}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Education"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.education.length == 0 ? "NA" : userProfile.education[0] == "" ? "NA" : userProfile.education[0]}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Ethnicity"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.ethnicity.length == 0 ? "NA" : userProfile.ethnicity[0] == "" ? "NA" : userProfile.ethnicity[0]}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Interest"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.passion.length == 0 ? "NA" : userProfile.passion.join(", ")}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Language"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.language.length == 0 ? "NA" : userProfile.language.join(", ")}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.activity.length == 0 ? "NA" : userProfile.activity.join(", ")}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Vaccination Status"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.vaccination_status.length == 0 ? "NA" : userProfile.vaccination_status[0] == "" ? "NA" : userProfile.vaccination_status[0]}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Relationship Status"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{userProfile.relationship_status.length == 0 ? "NA" : userProfile.relationship_status[0] == "" ? "NA" : userProfile.relationship_status[0]}
                        </div>
                    </div>
                </div>
            </div>
        </Widget>
        <Widget description={"Profile Pictures"}>
            <div className="w-3/5 content-center mx-auto">
                <ImageGallery
                    items={
                        userProfile.image_url.map((element) => {
                                return {
                                    original: `${IMAGE_ROOT}/${element.original}`,
                                    thumbnail: `${IMAGE_ROOT}/${element.thumbnail}`,
                                }
                            }
                        )
                    } showIndex={true} autoPlay={false} showPlayButton={false}
                />
            </div>

        </Widget>
    </>
}

const TabOffer = ({offer}: TabOfferProps) => {
    return <>
        <Widget>

        </Widget>
    </>
}

const TabOrder = ({order}: TabOrderProps) => {
    return <>
        <Widget>

        </Widget>
    </>
}

export default function Index() {
    const router = useRouter();
    const {id} = router.query;
    const [data, setData] = useState<Dispute | null>(() => null)
    const [currentStatus, setCurrentStatus] = useState<string | null>(() => null)

    const [tabs, setTabs] = useState<TabProps[]>(() => []);

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

                        var tabsTemp: TabProps[] = [];
                        tabsTemp = [
                            ...tabsTemp,
                            {
                                index: 0,
                                title: "Request Info",
                                active: true,
                                content: <TabDispute dispute={data} onUpdate={onUpdate}/>
                            } as TabProps
                        ];

                        switch (data.dispute_object) {
                            case "UserProfile":
                                if (data.object_id != data.user_id) {
                                    // other user
                                    tabsTemp = [
                                        ...tabsTemp,
                                        {
                                            index: 2,
                                            title: "Dispute Object (User Profile)",
                                            active: false,
                                            content: <TabUserProfile userProfile={data.object}/>
                                        } as TabProps
                                    ];
                                } else {
                                    if (data.user_profile !== null) {
                                        tabsTemp = [
                                            ...tabsTemp,
                                            {
                                                index: 1,
                                                title: "Request User",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.user_profile}/>
                                            } as TabProps
                                        ];
                                    }
                                }
                                break;
                            case "Offer":
                                if (data.object !== null) {
                                    if (data.object.payer_id !== data.user_id) {
                                        tabsTemp = [
                                            ...tabsTemp,
                                            {
                                                index: 1,
                                                title: "Request User (Payee)",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.user_profile}/>
                                            } as TabProps,
                                            {
                                                index: 2,
                                                title: "Payer",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.object.payer}/>
                                            } as TabProps
                                        ];
                                    } else {
                                        tabsTemp = [
                                            ...tabsTemp,
                                            {
                                                index: 1,
                                                title: "Request User (Payer)",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.user_profile}/>
                                            } as TabProps,
                                            {
                                                index: 2,
                                                title: "Payee",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.object.payee}/>
                                            } as TabProps
                                        ];
                                    }
                                    tabsTemp = [
                                        ...tabsTemp,
                                        {
                                            index: 3,
                                            title: "Dispute Object (Offer)",
                                            active: false,
                                            content: <TabOffer offer={data.object}/>
                                        } as TabProps
                                    ];
                                }
                                break;
                            case "Order":
                                if (data.object !== null) {
                                    if (data.object.payer_id !== data.user_id) {
                                        tabsTemp = [
                                            ...tabsTemp,
                                            {
                                                index: 1,
                                                title: "Request User (Payee)",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.user_profile}/>
                                            } as TabProps,
                                            {
                                                index: 2,
                                                title: "Payer",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.object.payer}/>
                                            } as TabProps
                                        ];
                                    } else {
                                        tabsTemp = [
                                            ...tabsTemp,
                                            {
                                                index: 1,
                                                title: "Request User (Payer)",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.user_profile}/>
                                            } as TabProps,
                                            {
                                                index: 2,
                                                title: "Payee",
                                                active: false,
                                                content: <TabUserProfile userProfile={data.object.payee}/>
                                            } as TabProps
                                        ];
                                    }
                                    tabsTemp = [
                                        ...tabsTemp,
                                        {
                                            index: 3,
                                            title: "Dispute Object (Order)",
                                            active: false,
                                            content: <TabOrder order={data.object}/>
                                        } as TabProps
                                    ];
                                }
                                break;
                        }
                        setTabs(tabsTemp);
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


    const onUpdate = async (formProps: DisputeFormProps) => {
        //eslint-disable-next-line
        // console.log(JSON.stringify(data, null, 2));
        await trackPromise(
            request
                .put(`/api/disputes/${id}/`, {
                    dispute_status: formProps.dispute_status,
                    dispute_notes: formProps.dispute_notes,
                    dispute_result: formProps.dispute_result,
                    note: formProps.note,
                })
                .then((res: any) => {
                    if (res.data.code === 200) {
                        notify(res.data.msg, "success")
                        getDispute();
                    } else {
                        notify(res.data.msg, "warn")
                    }
                }));

    };

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
                        tabs
                    }/>
                </div>
            </div>

        </> : <>Not Found</>
    )

}
