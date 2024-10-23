import { captureOrder } from "@/lib/features/account";
import { useAppDispatch } from '@/lib/hooks';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

function PayPalCheckout({ value }) {
    const dispatch = useAppDispatch();
    function createOrder() {
        return axios.post("payment/paypal/create-order", value)
            .then((r) => r.data);
    }

    function onApprove(data) {
        return dispatch(captureOrder(data.orderID));
    }

    return (
        <div>
            <PayPalButtons
                forceReRender={[value]}
                createOrder={createOrder}
                onApprove={onApprove} />
        </div>
    );
}

export default PayPalCheckout;