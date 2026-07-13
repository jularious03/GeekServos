//% color="#FFC0CB" block="InnRaum"
namespace InnRaum {
  //% blockId="set_color_eyes"
  //% block="set $color for eyes"
  //% color.defl=NeoPixelColors.Red
  export function setcolorEyes(color: NeoPixelColors): void {
    const leds = robotbit.rgb();

    leds.setPixelColor(0, neopixel.colors(color));
    leds.setPixelColor(1, neopixel.colors(color));
    leds.show();
  }

  //% blockId="set_color_feeler"
  //% block="set $color for feeler"
  //% color.defl=NeoPixelColors.Red
  export function setcolorFeeler(color: NeoPixelColors): void {
    const leds = robotbit.rgb();

    leds.setPixelColor(2, neopixel.colors(color));
    leds.setPixelColor(3, neopixel.colors(color));
    leds.show();
  }

  /**
   * Measures the soil moisture in percent.
   * @param pin analog pin connected to the sensor, eg: AnalogPin.P0
   */
  //% blockId="measure_soil_moisture"
  //% block="measure soil moisture at $pin in percent"
  //% pin.defl=AnalogPin.P0
  export function measureSoilMoisture(pin: AnalogPin): number {
    const value = pins.analogReadPin(pin);
    return mapValue(value, 218, 300, 0, 100);
  }

  /**
   * Measures the distance using an ultrasonic sensor.
   * @param trigPin pin connected to TRIG, eg: DigitalPin.P1
   * @param echoPin pin connected to ECHO, eg: DigitalPin.P2
   */
  //% blockId="measure_ultrasonic_distance"
  //% block="measure distance in cm with TRIG $trigPin and ECHO $echoPin"
  //% trigPin.defl=DigitalPin.P1
  //% echoPin.defl=DigitalPin.P2
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
