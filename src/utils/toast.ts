import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


class Notification {

    constructor(duration = 3000) {
        (this as any).duration = duration
        if (typeof window !== "undefined") {
            (this as any).notif = new Notyf({
                duration: (this as any).duration,
                position: {
                    x: "right",
                    y: "top"
                }
            })
        }

    }

    error(message = "ERROR") {
        let formatedMsg = message.split("")[0].toUpperCase() + message.slice(1);
        (this as any).notif.error({
            message: formatedMsg,
            dismissible: true
        })
    }

    success(message = "SUCCESS") {
        let formatedMsg = message.split("")[0].toUpperCase() + message.slice(1);
        (this as any).notif.success({
            message: formatedMsg,
            dismissible: true
        })
    }
}

export default Notification

