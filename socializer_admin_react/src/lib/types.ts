export interface Note {
    note: string;
    sent_at: string;
    user_id: string;
    nickname: string;
    host_or_guest: string;
}

export interface Dispute {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: number;
    user_id: string;
    dispute_object: string;
    object_id: string;
    dispute_type: string;
    dispute_reason: string;
    dispute_status: string;
    dispute_result: string;
    dispute_notes: string;
    dispute_resolved_at: string;
    dispute_resolved_by: string;
    notes: Note[];
    dispute_processed_at: string;
    dispute_processed_by: string;
    attachments: ImageURL[];
    object: Object | null;
    user_profile: UserProfile | null;
}

export type Object = Offer | UserProfile | Order;

export interface Offer {
    id: string;
    payee: UserProfile;
    payer: UserProfile;
    created_at: string;
    updated_at: string;
    deleted_at: number;
    link_offer_id: string;
    creator_id: string;
    payer_id: string;
    payee_id: string;
    activity_category: string;
    title: string;
    description: string;
    notes_payee: string;
    notes_payer: string;
    from_datetime: string;
    to_datetime: string;
    total_duration_hour: string;
    price_per_hour: string;
    price_currency: string;
    total_price: string;
    meeting_postal_code: string;
    meeting_address: string;
    meeting_suburb: string;
    meeting_state: string;
    meeting_country: string;
    meeting_lat: string;
    meeting_long: string;
    offer_status: string;
    offer_sn: string;
    activity_sub_category: string[];
    image_url: ImageURL[];
    notes: Note[];
}

export interface UserProfile {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: number;
    user_id: string;
    username: string;
    nickname: string;
    living_postal_code: string;
    living_suburb: string;
    living_state: string;
    living_country: string;
    dob: string;
    height: number;
    smoking: string;
    drinking: string;
    about_me: string;
    gender: string[];
    education: string[];
    ethnicity: string[];
    passion: string[];
    language: string[];
    activity: any[];
    is_profile_searchable: boolean;
    image_url: ImageURL[];
    video_url: any[];
    vaccination_status: string[];
    social_media: any[];
    living_lat: string;
    relationship_status: string[];
    living_long: string;
    is_available_now: boolean;
    invitation_code: string;
    pass_code: string;
    is_verified: boolean;
}

export interface ImageURL {
    original: string;
    thumbnail: string;
}

export interface Order {
    id:                           string;
    payee:                        UserProfile;
    payer:                        UserProfile;
    created_at:                   string;
    updated_at:                   string;
    deleted_at:                   number;
    payer_id:                     string;
    payee_id:                     string;
    offer_id:                     string;
    activity_category:            string;
    title:                        string;
    description:                  string;
    notes_payee:                  string;
    notes_payer:                  string;
    from_datetime:                string;
    to_datetime:                  string;
    total_duration_hour:          string;
    price_per_hour:               string;
    price_currency:               string;
    total_price:                  string;
    meeting_postal_code:          string;
    meeting_address:              string;
    meeting_suburb:               string;
    meeting_state:                string;
    meeting_country:              string;
    meeting_lat:                  string;
    meeting_long:                 string;
    order_status:                 string;
    order_sn:                     string;
    payment_type:                 string;
    payment_id:                   string;
    paid_at:                      string;
    paid_amount:                  string;
    is_refunded:                  boolean;
    refund_amount:                string;
    refund_at:                    string;
    is_paid_out:                  boolean;
    payout_amount:                string;
    payout_at:                    string;
    fee_amount:                   string;
    cancellation_requested_at:    string;
    paid_credit_amount:           string;
    paid_credit_at:               string;
    finalized_at:                 string;
    credit_payment_id:            string;
    extended_paid_at:             string;
    extended_price_per_hour:      string;
    extended_datetime:            string;
    is_extended:                  boolean;
    extended_duration_hour:       string;
    extended_total_price:         string;
    extended_paid_amount:         string;
    extended_payment_id:          string;
    extended_price_currency:      string;
    extended_paid_credit_amount:  string;
    extended_credit_payment_id:   string;
    extended_payment_type:        string;
    extended_paid_credit_at:      string;
    extend_finalized_at:          string;
    extend_status:                string;
    extend_id:                    string;
    extend_sn:                    null;
    activity_sub_category:        string[];
    meeting_code:                 string;
    image_url:                    ImageURL[];
    notes:                        Note[];
    extended_paid_processing_fee: string;
    paid_processing_fee:          string;
}