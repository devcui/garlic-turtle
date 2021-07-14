/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 17:39:35
 * @LastEditTime: 2021-07-14 17:39:35
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/chunk/splt.ts
 * @LICENSE: NONE
 */

import { Chunk } from "./chunk.ts";

export class Splt extends Chunk {
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
