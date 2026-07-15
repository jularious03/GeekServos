enum CCS811Measurement {
  //% block="eCO2"
  ECO2 = 0,
  //% block="TVOC"
  TVOC = 1,
}

//% color=#204830 icon="\uf0c2" block="MintKöpfchen"
namespace MintKoepfchen {
  let ccs811WarmedUp = false;

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

  /**
   * Warms up the CCS811 for two minutes on the first call and then returns
   * either eCO2 in ppm or TVOC in ppb. Returns -1 on an error.
   */
  //% blockId="measure_ccs811_air_quality"
  //% block="measure CCS811 $measurement after warm-up"
  //% measurement.defl=CCS811Measurement.ECO2
  export function measureAirQuality(measurement: CCS811Measurement): number {
    if (!ccs811WarmedUp) {
      const sensorFound = CCS811.begin(CCS811Address.Address0x5A);

      if (!sensorFound) {
        serial.writeLine('CCS811 nicht gefunden');
        serial.writeValue('Hardware-ID', CCS811.hardwareID());
        return -1;
      }

      serial.writeLine('CCS811 Aufwaermphase gestartet');
      basic.pause(120000);
      ccs811WarmedUp = true;
      serial.writeLine('CCS811 Aufwaermphase beendet');
    }

    // Normally a new sample is available every second. The timeout prevents
    // the program from blocking forever if the sensor is disconnected.
    const timeoutAt = input.runningTime() + 5000;
    while (!CCS811.readData()) {
      if (CCS811.errorCode() != 0) {
        serial.writeValue('CCS811 Fehler', CCS811.errorCode());
        return -1;
      }

      if (input.runningTime() >= timeoutAt) {
        serial.writeLine('CCS811 Zeitueberschreitung');
        return -1;
      }

      basic.pause(100);
    }

    if (measurement == CCS811Measurement.TVOC) {
      return CCS811.TVOC();
    }

    return CCS811.eCO2();
  }
}
