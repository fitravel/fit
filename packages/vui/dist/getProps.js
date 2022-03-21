import { get } from "@vueuse/core";
import { mapObjIndexed } from "ramda";
//@ts-ignore
export const getProps = (i) => mapObjIndexed((key, value) => get(value))(i);
export default getProps;
//# sourceMappingURL=getProps.js.map