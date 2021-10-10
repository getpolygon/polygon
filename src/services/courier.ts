import { CourierClient } from "@trycourier/courier";
const { COURIER_TOKEN: authorizationToken } = process.env;

const courier = CourierClient({ authorizationToken });
export default courier;
