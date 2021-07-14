/*
 * @Author: cuihaonan
 * @Email: devcui@outlook.com
 * @Date: 2021-07-14 10:32:00
 * @LastEditTime: 2021-07-14 14:17:16
 * @LastEditors: cuihaonan
 * @Description: Basic description
 * @FilePath: /devcui-cli/png.ts
 * @LICENSE: NONE
 */

// png model
export class PNG {
  binary: Uint8Array = Uint8Array.from([]);

  constructor(binary: Uint8Array) {
    this.binary = binary;
    this.deconstructionBinary();
  }

  // de construct binary file chunks
  deconstructionBinary(): void {}
}
