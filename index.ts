/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-12 15:31:06
 * @LastEditTime: 2021-07-14 14:11:09
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/index.ts
 * @LICENSE: NONE
 */
import { PNG_HEADER } from "./consts.ts";
import { PNG } from "./png.ts";
import { readFileType, cutFileTypeBuffer } from "./utils.ts";
import { catchVenusaur, positionVenusaur } from "./utils.ts";

positionVenusaur().map((position) => {
  // generate file path
  const dir = Deno.cwd() + position;
  const binary: Uint8Array = catchVenusaur(dir);
  //  check the file type was png ?
  const fileType = readFileType(binary);
  if (fileType !== PNG_HEADER) {
    throw Deno.errors.InvalidData(`${dir} file was not a file png!`);
  }
  // cut the file type buffer and generate PNG model
  return new PNG(cutFileTypeBuffer(binary));
});
