import * as wasm from "./webapp_bg.wasm";
import { __wbg_set_wasm } from "./webapp_bg.js";
__wbg_set_wasm(wasm);
export * from "./webapp_bg.js";

wasm.__wbindgen_start();
