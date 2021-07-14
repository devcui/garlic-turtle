/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 14:25:17
 * @LastEditTime: 2021-07-14 16:39:47
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/chunk/ihdr.ts
 * @LICENSE: NONE
 */

import {
  IHDR_BIT_DEPTH_BYTES,
  IHDR_HEIGHT_BYTES,
  IHDR_WIDTH_BYTES,
  IHDR_COLOR_TYPE_BYTES,
  IHDR_COMPRESSION_METHOD_BYTES,
  IHDR_FILTER_METHOD_BYTES,
  IHDR_INTERLACE_METHOD_BYTES,
} from "../consts.ts";
import { readInt32 } from "../utils.ts";
import { Chunk } from "./chunk.ts";

export class IHDR extends Chunk {
  width = 0;
  height = 0;
  bitDepth = 0;
  colorType = 0;
  compressionMethod = 0;
  filterMethod = 0;
  interlaceMethod = 0;

  constructor(
    id:number,
    chunkLen: number,
    chunkType: string,
    chunkData: Uint8Array,
    chunkCRC: Uint8Array
  ) {
    super(id,chunkLen, chunkType, chunkData, chunkCRC);
    this.parse();
  }

  parse(): void {
    // read ihdr info from chunk data
    let offset = 0;
    this.width = readInt32(this.chunkData.slice(offset, (offset += IHDR_WIDTH_BYTES)));
    this.height = readInt32(this.chunkData.slice(offset, (offset += IHDR_HEIGHT_BYTES)));
    this.bitDepth = this.chunkData.slice(offset,(offset += IHDR_BIT_DEPTH_BYTES))[0];
    this.colorType = this.chunkData.slice(offset,(offset += IHDR_COLOR_TYPE_BYTES))[0];
    this.compressionMethod = this.chunkData.slice(offset,(offset += IHDR_COMPRESSION_METHOD_BYTES))[0];
    this.filterMethod = this.chunkData.slice(offset,(offset += IHDR_FILTER_METHOD_BYTES))[0];
    this.interlaceMethod = this.chunkData.slice(offset,(offset += IHDR_INTERLACE_METHOD_BYTES))[0];
  }
}
