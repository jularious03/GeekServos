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

  /**
   *
   * @returns the measurement of soil moisture sensor in percent
   */
  //% block="measure soil moisture in %"
  export function measureSoilMoisture(pin: AnalogPin): number {
    const value = pins.analogReadPin(pin);
    return mapValue(value, 218, 300, 0, 100);
  }

  /**
   *
   * @returns the measurement of the ultrasonic sensor in centimeter
   */
  //% block="measure distance in cm"
  export function measureDistance(
    trigPin: DigitalPin,
    echoPin: DigitalPin,
  ): number {
    let distance = sonar.ping(trigPin, echoPin, PingUnit.Centimeters);
    return distance;
  }

  function mapValue(
    value: number,
    inputMin: number,
    inputMax: number,
    outputMin: number,
    outputMax: number,
  ): number {
    if (inputMin == inputMax) {
      return outputMin;
    }

    return (
      ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
      outputMin
    );
  }
}
