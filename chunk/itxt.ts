/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 17:38:38
 * @LastEditTime: 2021-07-14 18:07:11
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/chunk/iTxt.ts
 * @LICENSE: NONE
 */

import { Chunk } from "./chunk.ts";

export class Itxt extends Chunk {
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
