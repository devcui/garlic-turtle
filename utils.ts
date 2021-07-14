/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-13 17:27:00
 * @LastEditTime: 2021-07-14 14:17:40
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/utils.ts
 * @LICENSE: NONE
 */

import { encodeToString } from "https://deno.land/std@0.100.0/encoding/hex.ts";
import { FILE_TYPE_BYTES } from "./consts.ts";

/**
 *  @returns Array<string> pokemon's position
 */
export function positionVenusaur(): Array<string> {
  return Array.from(new Array(59).keys()).map((n) => `/animate/giphy-${n}.png`);
}

/**
 * @returns Unit8Array binary from pokemon
 */
export function catchVenusaur(position: string): Uint8Array {
  return Deno.readFileSync(position);
}

// get file type
export function readFileType(binary: Uint8Array): string {
  return encodeToString(binary.slice(0, FILE_TYPE_BYTES));
}

// cut the file type from the buffer
export function cutFileTypeBuffer(binary: Uint8Array): Uint8Array {
  return binary.slice(FILE_TYPE_BYTES, binary.length);
}
