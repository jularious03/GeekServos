//% color="FFC0CB" icon="\u489" block="InnRaum"

namespace InnRaum {
  /**
   * Shows a greeting on the LED-Pad
   */
  //% block="show gretting"
  export function showMessage(): void {
    basic.showString('hello world');
  }

  //% block="wait for %ms ms"
  export function waitMs(ms: number): void {
    basic.pause(ms);
  }
}
