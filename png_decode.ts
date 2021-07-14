/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 10:32:00
 * @LastEditTime: 2021-07-15 13:46:45
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/png_decode.ts
 * @LICENSE: NONE
 */

import {
  CHUNK_CONTEXT_LEN_BYTES,
  CHUNK_CRC_BYTES,
  CHUNK_TYPE_BYTES,
} from "./consts.ts";
import { bufferToString, readInt32 } from "./utils.ts";
import {
  Bkgd,
  Chrm,
  Chunk,
  Gama,
  Hist,
  ICCP,
  IDAT,
  IEND,
  IHDR,
  Itxt,
  Phys,
  Plte,
  Sbit,
  Splt,
  Srgb,
  Text,
  Time,
  Trns,
  Ztxt,
} from "./chunk/mod.ts";
import { unzlib } from "https://deno.land/x/denoflate@1.2.1/mod.ts";
import { concat } from "https://deno.land/std@0.100.0/bytes/mod.ts";

// png model
export class PNGDecoder {
  binary = Uint8Array.from([]);
  chunks: Array<Chunk> = [];
  
  constructor(binary: Uint8Array) {
    this.binary = binary;
    this.deconstruct();
  }

  deconstruct() {
    const { binary } = this;
    // current position
    let offset = 0;
    // read png circularly
    while (offset != binary.buffer.byteLength) {
      const chunkLen = readInt32(
        binary.slice(offset, (offset += CHUNK_CONTEXT_LEN_BYTES)),
      );
      const chunkType = bufferToString(
        binary.slice(offset, (offset += CHUNK_TYPE_BYTES)),
      );
      const chunkData = binary.slice(offset, (offset += chunkLen));
      const chunkCRC = binary.slice(offset, (offset += CHUNK_CRC_BYTES));
      switch (chunkType) {
        case "IHDR":
          this.chunks.push(
            new IHDR(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "PLTE":
          this.chunks.push(
            new Plte(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "IDAT":
          this.chunks.push(
            new IDAT(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "IEND":
          this.chunks.push(
            new IEND(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "tRNS":
          this.chunks.push(
            new Trns(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "cHRM":
          this.chunks.push(
            new Chrm(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "gAMA":
          this.chunks.push(
            new Gama(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "iCCP":
          this.chunks.push(
            new ICCP(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "sBIT":
          this.chunks.push(
            new Sbit(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "sRGB":
          this.chunks.push(
            new Srgb(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "iTXt":
          this.chunks.push(
            new Itxt(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "tEXt":
          this.chunks.push(
            new Text(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "zTXt":
          this.chunks.push(
            new Ztxt(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "bKGD":
          this.chunks.push(
            new Bkgd(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "hIST":
          this.chunks.push(
            new Hist(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "pHYs":
          this.chunks.push(
            new Phys(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "sPLT":
          this.chunks.push(
            new Splt(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        case "tIME":
          this.chunks.push(
            new Time(offset, chunkLen, chunkType, chunkData, chunkCRC),
          );
          break;
        default:
          throw new Deno.errors.NotFound(
            `can not understand chunk with type: ${chunkType}`,
          );
      }
    }
  }

  unzip(): Uint8Array {
    const ihdr = this.getChunkByType("IHDR")[0] as IHDR;
    if (ihdr.compressionMethod === 0) {
      const idats = this.chunks
        .filter((a) => {
          return a.chunkType === "IDAT";
        })
        .sort((a, b) => a.id - b.id)
        .map((a) => {
          return a.chunkData;
        }).reduce((a, b) => {
          return concat(a, b);
        });
      return unzlib(idats);
    } else {
      return Uint8Array.from([]);
    }
  }

  // get chunk by type
  getChunkByType(type: string): Chunk[] {
    return this.chunks.filter((a) => {
      return a.chunkType === type;
    });
  }
}
