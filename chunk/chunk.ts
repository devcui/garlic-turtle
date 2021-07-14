/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 14:21:51
 * @LastEditTime: 2021-07-14 18:00:45
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/chunk/chunk.ts
 * @LICENSE: NONE
 */

export abstract class Chunk {
  id = 0;
  chunkLen = 0;
  chunkType = "";
  chunkData = Uint8Array.from([]);
  chunkCRC = Uint8Array.from([]);

  // deno-lint-ignore no-explicit-any
  [key: string]: any;

  constructor(
    id: number,
    chunkLen: number,
    chunkType: string,
    chunkData: Uint8Array,
    chunkCRC: Uint8Array
  ) {
    this.id = id;
    this.chunkLen = chunkLen;
    this.chunkType = chunkType;
    this.chunkData = chunkData;
    this.chunkCRC = chunkCRC;
  }

  abstract parse(): void;
}
