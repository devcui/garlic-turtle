/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-12 15:31:06
 * @LastEditTime: 2021-07-15 16:24:43
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/index.ts
 * @LICENSE: NONE
 */
import { IHDR } from "./chunk/ihdr.ts";
import { PNG_HEADER } from "./consts.ts";
import { PNGDecoder } from "./png_decode.ts";
import { cutFileTypeBuffer, readFileType } from "./utils.ts";
import { catchVenusaur, positionVenusaur } from "./utils.ts";
import * as colors from "https://deno.land/std@0.100.0/fmt/colors.ts";
import { concat } from "https://deno.land/std@0.100.0/bytes/mod.ts";

const _pngs = positionVenusaur().map((position) => {
  // generate file path
  const dir = Deno.cwd() + position;
  const binary: Uint8Array = catchVenusaur(dir);
  //  check the file type was png ?
  const fileType = readFileType(binary);
  if (fileType !== PNG_HEADER) {
    throw Deno.errors.InvalidData(`${dir} file was not a file png!`);
  }
  // cut the file type buffer and generate PNG model
  return new PNGDecoder(cutFileTypeBuffer(binary));
});

const imgbuffers: Array<Uint8Array> = [];

let png_i = 0;
while (png_i < _pngs.length) {
  console.log("loading about 1 minutes...");
  if (png_i > _pngs.length) {
    png_i = 0;
  }
  const png = _pngs[png_i];
  const ihdr = png.getChunkByType("IHDR")[0] as IHDR;
  const idat = png.unzip();
  const { width, height, colorType, bitDepth } = ihdr;
  const bytesPerPixel = 1;
  const bytesPerRow = bytesPerPixel * width;
  const pixelsBuffer: Uint8Array = new Uint8Array(bytesPerRow * height).fill(0);

  let offset = 0;
  for (let i = 0; i < idat.length; i += bytesPerRow + 1) {
    let scanline = Array.prototype.slice.call(idat, i + 1, i + 1 + bytesPerRow); // 当前行
    switch (idat[0]) {
      case 0:
        filterNone(scanline, bytesPerPixel, bytesPerRow, offset);
        break;
      case 1:
        filterSub(scanline, bytesPerPixel, bytesPerRow, offset);
        break;
      case 2:
        filterUp(scanline, bytesPerPixel, bytesPerRow, offset);
        break;
      case 3:
        filterAverage(scanline, bytesPerPixel, bytesPerRow, offset);
        break;
      case 4:
        filterPaeth(scanline, bytesPerPixel, bytesPerRow, offset);
        break;
      default:
        throw new Error("未知过滤类型！");
    }
    offset += bytesPerRow;
  }

  function filterNone(
    scanline: any,
    bytesPerPixel: any,
    bytesPerRow: any,
    offset: any,
  ) {
    for (let i = 0; i < bytesPerRow; i++) {
      pixelsBuffer[offset + i] = scanline[i];
    }
  }

  function filterSub(
    scanline: any,
    bytesPerPixel: any,
    bytesPerRow: any,
    offset: any,
  ) {
    for (let i = 0; i < bytesPerRow; i++) {
      if (i < bytesPerPixel) {
        // 第一个像素，不作解析
        pixelsBuffer[offset + i] = scanline[i];
      } else {
        // 其他像素
        let a = pixelsBuffer[offset + i - bytesPerPixel];

        let value = scanline[i] + a;
        pixelsBuffer[offset + i] = value & 0xFF;
      }
    }
  }

  function filterUp(
    scanline: any,
    bytesPerPixel: any,
    bytesPerRow: any,
    offset: any,
  ) {
    if (offset < bytesPerRow) {
      // 第一行，不作解析
      for (let i = 0; i < bytesPerRow; i++) {
        pixelsBuffer[offset + i] = scanline[i];
      }
    } else {
      for (let i = 0; i < bytesPerRow; i++) {
        let b = pixelsBuffer[offset + i - bytesPerRow];

        let value = scanline[i] + b;
        pixelsBuffer[offset + i] = value & 0xFF;
      }
    }
  }

  function filterAverage(
    scanline: any,
    bytesPerPixel: any,
    bytesPerRow: any,
    offset: any,
  ) {
    if (offset < bytesPerRow) {
      // 第一行，只做Sub
      for (let i = 0; i < bytesPerRow; i++) {
        if (i < bytesPerPixel) {
          // 第一个像素，不作解析
          pixelsBuffer[offset + i] = scanline[i];
        } else {
          // 其他像素
          let a = pixelsBuffer[offset + i - bytesPerPixel];

          let value = scanline[i] + (a >> 1); // 需要除以2
          pixelsBuffer[offset + i] = value & 0xFF;
        }
      }
    } else {
      for (let i = 0; i < bytesPerRow; i++) {
        if (i < bytesPerPixel) {
          // 第一个像素，只做Up
          let b = pixelsBuffer[offset + i - bytesPerRow];

          let value = scanline[i] + (b >> 1); // 需要除以2
          pixelsBuffer[offset + i] = value & 0xFF;
        } else {
          // 其他像素
          let a = pixelsBuffer[offset + i - bytesPerPixel];
          let b = pixelsBuffer[offset + i - bytesPerRow];

          let value = scanline[i] + ((a + b) >> 1);
          pixelsBuffer[offset + i] = value & 0xFF;
        }
      }
    }
  }

  function filterPaeth(
    scanline: any,
    bytesPerPixel: any,
    bytesPerRow: any,
    offset: any,
  ) {
    if (offset < bytesPerRow) {
      // 第一行，只做Sub
      for (let i = 0; i < bytesPerRow; i++) {
        if (i < bytesPerPixel) {
          // 第一个像素，不作解析
          pixelsBuffer[offset + i] = scanline[i];
        } else {
          // 其他像素
          let a = pixelsBuffer[offset + i - bytesPerPixel];

          let value = scanline[i] + a;
          pixelsBuffer[offset + i] = value & 0xFF;
        }
      }
    } else {
      for (let i = 0; i < bytesPerRow; i++) {
        if (i < bytesPerPixel) {
          // 第一个像素，只做Up
          let b = pixelsBuffer[offset + i - bytesPerRow];

          let value = scanline[i] + b;
          pixelsBuffer[offset + i] = value & 0xFF;
        } else {
          // 其他像素
          let a = pixelsBuffer[offset + i - bytesPerPixel];
          let b = pixelsBuffer[offset + i - bytesPerRow];
          let c = pixelsBuffer[offset + i - bytesPerRow - bytesPerPixel];

          let p = a + b - c;
          let pa = Math.abs(p - a);
          let pb = Math.abs(p - b);
          let pc = Math.abs(p - c);
          let pr;

          if (pa <= pb && pa <= pc) pr = a;
          else if (pb <= pc) pr = b;
          else pr = c;

          let value = scanline[i] + pr;
          pixelsBuffer[offset + i] = value & 0xFF;
        }
      }
    }
  }

  let palette = png.getChunkByType("PLTE")[0].chunkData; // PLTE数据块内容，即调色板内容
  let transparentPanel = png.getChunkByType("tRNS")[0].chunkData; // 透明像素面板，解析tRNS数据块获得

  function getPixel(x: number, y: number) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      throw new Error("x或y的值超出了图像边界！");
    }

    let bytesPerPixel = 1; // 每像素字节数
    let index = bytesPerPixel * (y * width + x);

    switch (colorType) {
      case 0:
        // 灰度图像
        return [
          pixelsBuffer[index],
          pixelsBuffer[index],
          pixelsBuffer[index],
          255,
        ];
      case 2:
        // rgb真彩色图像
        return [
          pixelsBuffer[index],
          pixelsBuffer[index + 1],
          pixelsBuffer[index + 2],
          255,
        ];
      case 3:
        // 索引颜色图像
        let paletteIndex = pixelsBuffer[index];

        let transparent = transparentPanel[paletteIndex];
        if (transparent === undefined) transparent = 255;

        return [
          palette[paletteIndex * 3 + 0],
          palette[paletteIndex * 3 + 1],
          palette[paletteIndex * 3 + 2],
          transparent,
        ];
      case 4:
        // 灰度图像 + alpha通道
        return [
          pixelsBuffer[index],
          pixelsBuffer[index],
          pixelsBuffer[index],
          pixelsBuffer[index + 1],
        ];
      case 6:
        // rgb真彩色图像 + alpha通道
        return [
          pixelsBuffer[index],
          pixelsBuffer[index + 1],
          pixelsBuffer[index + 2],
          pixelsBuffer[index + 3],
        ];
    }
  }

  colors.setColorEnabled(true);
  let images: Uint8Array = new Uint8Array();
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      const c = getPixel(w, h) as Array<number>;
      const a = new TextEncoder().encode(
        colors.bgRgb8(" ", rgbToAnsi256(c[0], c[1], c[2])),
      );
      images = concat(images, a);
    }
    images = concat(images, new TextEncoder().encode("\n"));
  }
  imgbuffers.push(images);

  png_i++;

  function rgbToAnsi256(r: number, g: number, b: number) {
    // we use the extended greyscale palette here, with the exception of
    // black and white. normal palette only has 4 greyscale shades.
    if (r === g && g === b) {
      if (r < 8) {
        return 16;
      }

      if (r > 248) {
        return 231;
      }

      return Math.round(((r - 8) / 247) * 24) + 232;
    }

    var ansi = 16 +
      (36 * Math.round(r / 255 * 5)) +
      (6 * Math.round(g / 255 * 5)) +
      Math.round(b / 255 * 5);

    return ansi;
  }
}

for (let i = 0; i <= imgbuffers.length; i++) {
  if (i = imgbuffers.length) i = 0;
  Deno.stdout.writeSync(imgbuffers[i]);
  Deno.sleepSync(500);
  clearScreen();
}
function clearScreen() {
  Deno.stdout.write(new TextEncoder().encode("\u001b[3J\u001b[2J\u001b[1J"));
  console.clear();
}
