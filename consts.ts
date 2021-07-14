/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 10:28:55
 * @LastEditTime: 2021-07-14 16:18:34
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/consts.ts
 * @LICENSE: NONE
 */

// png
export const PNG_HEADER = "89504e470d0a1a0a";
export const FILE_TYPE_BYTES = 8;
// chunk
export const CHUNK_CONTEXT_LEN_BYTES = 4;
export const CHUNK_TYPE_BYTES = 4;
export const CHUNK_CRC_BYTES = 4;
// The IHDR chunk shall be the first chunk in the PNG datastream.
export const IHDR_WIDTH_BYTES = 4;
export const IHDR_HEIGHT_BYTES = 4;
export const IHDR_BIT_DEPTH_BYTES = 1;
export const IHDR_COLOR_TYPE_BYTES = 1;
export const IHDR_COMPRESSION_METHOD_BYTES = 1;
export const IHDR_FILTER_METHOD_BYTES = 1;
export const IHDR_INTERLACE_METHOD_BYTES = 1;
