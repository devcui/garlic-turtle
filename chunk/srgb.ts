/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 17:48:46
 * @LastEditTime: 2021-07-14 17:48:59
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/chunk/srgb.ts
 * @LICENSE: NONE
 */

import { Chunk } from "./chunk.ts";

export class Srgb extends Chunk {
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

  }

}
