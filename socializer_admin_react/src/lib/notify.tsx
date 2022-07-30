import {toast} from "react-toastify";
import {ToastOptions} from "react-toastify/dist/types";


const defaultToastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
}

export const notify = (message: string, type: "success" | "warn" | "error" | "info") => {
    switch (type) {
        case "success":
            toast.success(message, defaultToastOptions);
            break;
        case "warn":
            toast.warn(message, defaultToastOptions);
            break;
        case "error":
            toast.error(message, defaultToastOptions);
            break;
        case "info":
            toast.info(message, defaultToastOptions);
            break;
    }
}