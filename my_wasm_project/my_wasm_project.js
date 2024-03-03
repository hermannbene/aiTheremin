import * as wasm from "./my_wasm_project_bg.wasm";
import { __wbg_set_wasm } from "./my_wasm_project_bg.js";
__wbg_set_wasm(wasm);
export * from "./my_wasm_project_bg.js";
