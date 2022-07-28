import {useRouter} from "next/router";
import {trackPromise} from "react-promise-tracker";
import ReactTimeago from "react-timeago";
import request from "../../service/fetch";
import {formatCurrency, formatDate, formatNumber, getAge, IMAGE_ROOT, IPage} from "../../lib";
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
        <Widget description={"Attachments"}>
            {
                dispute.attachments.length > 0 ? <div className="w-3/5 content-center mx-auto">
                    <ImageGallery
                        items={
                            dispute.attachments.map((element) => {
                                    return {
                                        original: `${IMAGE_ROOT}/${element.original}`,
                                        thumbnail: `${IMAGE_ROOT}/${element.thumbnail}`,
                                    }
                                }
                            )
                        } showIndex={true} autoPlay={false} showPlayButton={false}
                    />
                </div> : <div
                    className="text-sm">There is no attachements
                </div>
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
                            className="text-sm">{formatDate(userProfile.dob)}, (Age {getAge(userProfile.dob)})
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
            {
                userProfile.image_url.length > 0 ? <div className="w-3/5 content-center mx-auto">
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
                </div> : <div
                    className="text-sm">There is no pictures
                </div>
            }

        </Widget>
    </>
}

const TabOffer = ({offer}: TabOfferProps) => {
    return <>
        <Widget description={"Basic Info"}>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Offer Id"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{offer.id}</div>
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
                        <div
                            className="text-sm">{formatDate(offer.created_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Last Updated At"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(offer.updated_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Offer Status"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{offer.offer_status}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Duration (in hour)"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatNumber(offer.total_duration_hour)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Price per Hour"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(offer.price_per_hour)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Total Price"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(offer.total_price)}
                        </div>
                    </div>
                </div>
            </div>
        </Widget>
        <Widget description={"Other Info"}>

            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity Category"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{offer.activity_category} | {offer.activity_sub_category}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity Title"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{offer.title}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity Description"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{offer.description}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Offer Meeting Location"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{offer.meeting_address}, {offer.meeting_suburb}, {offer.meeting_state}, {offer.meeting_country} {offer.meeting_postal_code} ({offer.meeting_lat}, {offer.meeting_long})
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Meeting From"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(offer.from_datetime)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Meeting To"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(offer.to_datetime)}
                        </div>
                    </div>
                </div>
            </div>
        </Widget>
        <Widget description={"Notes"}>
            {
                offer.notes.length == 0 ?
                    <div className="text-sm">There isn't any notes</div>
                    :
                    offer.notes.map((note, index) =>
                        <div className="flex flex-col lg:flex-row mb-3" key={index}>
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm font-bold">{note.host_or_guest == "Guest" ? "Guest" : "Host"}</div>
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
        </Widget>
        <Widget description={"Activity Pictures"}>
            {
                offer.image_url.length > 0 ? <div className="w-3/5 content-center mx-auto"><ImageGallery
                        items={
                            offer.image_url.map((element) => {
                                    return {
                                        original: `${IMAGE_ROOT}/${element.original}`,
                                        thumbnail: `${IMAGE_ROOT}/${element.thumbnail}`,
                                    }
                                }
                            )
                        } showIndex={true} autoPlay={false} showPlayButton={false}
                    /></div>
                    : <div
                        className="text-sm">There is no pictures
                    </div>
            }
        </Widget>
    </>
}

const TabOrder = ({order}: TabOrderProps) => {
    return <>
        <Widget description={"Basic Info"}>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Order Id"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm">{order.id}</div>
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
                        <div
                            className="text-sm">{formatDate(order.created_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Last Updated At"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(order.updated_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Order Status"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.order_status}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Duration (in hour)"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatNumber(order.total_duration_hour)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Price per Hour"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(order.price_per_hour)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Total Price"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(order.total_price)}
                        </div>
                    </div>
                </div>
            </div>
        </Widget>
        <Widget description={"Other Info"}>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity Category"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.activity_category} | {order.activity_sub_category}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity Title"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.title}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Activity Description"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.description}</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Offer Meeting Location"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.meeting_address}, {order.meeting_suburb}, {order.meeting_state}, {order.meeting_country} {order.meeting_postal_code} ({order.meeting_lat}, {order.meeting_long})
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Meeting From"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(order.from_datetime)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Meeting To"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(order.to_datetime)}
                        </div>
                    </div>
                </div>
            </div>
        </Widget>
        <Widget description={"Transaction Info"}>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Paid Amount"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.payment_type == "Stripe" ? formatCurrency(order.paid_amount) : formatCurrency(order.paid_credit_amount)}
                        </div>
                    </div>
                </div>
            </div>
            {
                order.payment_type == "Stripe" ? <div className="flex flex-wrap mb-3">
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div className="text-sm font-bold">{"Stripe Fee"}</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col w-full">
                            <div
                                className="text-sm">{formatCurrency(order.paid_processing_fee)}
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Paid At"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.payment_type == "Stripe" ? formatDate(order.paid_at) : formatDate(order.paid_credit_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Payment Type"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.payment_type} | {order.payment_type == "Stripe" ? order.payment_id : order.credit_payment_id}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Is Refunded"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.is_refunded.toString()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Refund Amount"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(order.refund_amount)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Refund At"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(order.refund_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Is Paid Out"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.is_paid_out.toString()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Payout Amount"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(order.payout_amount)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Payout At"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatDate(order.payout_at)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Service Fee"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{formatCurrency(order.fee_amount)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-3">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div className="text-sm font-bold">{"Is Meeting Extended"}</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col w-full">
                        <div
                            className="text-sm">{order.is_extended.toString()}
                        </div>
                    </div>
                </div>
            </div>
            {
                order.is_extended ? <>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Extended Status"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{formatCurrency(order.extend_status)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Extended Price per Hour"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{formatCurrency(order.extended_price_per_hour)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Extended Total Price"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{formatCurrency(order.extended_total_price)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Extended Duration"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{formatNumber(order.extended_duration_hour)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Extended To"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{formatDate(order.extended_datetime)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Extend Paid Amount"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{order.extended_payment_type == "Stripe" ? formatCurrency(order.extended_paid_amount) : formatCurrency(order.extended_paid_credit_amount)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        order.extended_payment_type == "Stripe" ? <div className="flex flex-wrap mb-3">
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-col w-full">
                                    <div className="text-sm font-bold">{"Stripe Fee"}</div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-col w-full">
                                    <div
                                        className="text-sm">{formatCurrency(order.extended_paid_processing_fee)}
                                    </div>
                                </div>
                            </div>
                        </div> : <></>
                    }
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Paid At"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{order.extended_payment_type == "Stripe" ? formatDate(order.extended_paid_at) : formatDate(order.extended_paid_credit_at)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">{"Payment Type"}</div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm">{order.extended_payment_type} | {order.extended_payment_type == "Stripe" ? order.extended_payment_id : order.extended_credit_payment_id}
                                </div>
                            </div>
                        </div>
                    </div>
                </> : <></>
            }
        </Widget>
        <Widget description={"Notes"}>
            {
                order.notes.length == 0 ?
                    <div className="text-sm">There isn't any notes</div>
                    :
                    order.notes.map((note, index) =>
                        <div className="flex flex-col lg:flex-row mb-3" key={index}>
                            <div className="flex flex-col w-full">
                                <div
                                    className="text-sm font-bold">{note.host_or_guest == "Guest" ? "Guest" : "Host"}</div>
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
        </Widget>
        <Widget description={"Activity Pictures"}>
            {
                order.image_url.length > 0 ? <div className="w-3/5 content-center mx-auto"><ImageGallery
                        items={
                            order.image_url.map((element) => {
                                    return {
                                        original: `${IMAGE_ROOT}/${element.original}`,
                                        thumbnail: `${IMAGE_ROOT}/${element.thumbnail}`,
                                    }
                                }
                            )
                        } showIndex={true} autoPlay={false} showPlayButton={false}
                    /></div>
                    : <div
                        className="text-sm">There is no pictures
                    </div>
            }
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
