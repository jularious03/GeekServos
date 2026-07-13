//% color="#FFC0CB" block="InnRaum"
namespace InnRaum {
  /**
   * Sets the color of LED 0 & 1 (the eyes)
   * @param color: the color set for LED 0 & 1
   */
  //% block="set color for eyes"
  export function setcolorEyes(color: NeoPixelColors): void {
    const leds = robotbit.rgb();

    leds.setPixelColor(0, neopixel.colors(color));
    leds.setPixelColor(1, neopixel.colors(color));
    leds.show();
  }

  /**
   * Sets the color of LED 2 & 3 (the feeler)
   * @param color : the color set for LED 2 & 3
   */
  //% block="set color for feeler"
  export function setcolorFeeler(color: NeoPixelColors): void {
    const leds = robotbit.rgb();

    leds.setPixelColor(2, neopixel.colors(color));
    leds.setPixelColor(3, neopixel.colors(color));
    leds.show();
  }
}
