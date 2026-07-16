enum CCS811Measurement {
  //% block="CO₂-Schätzwert (eCO₂, ppm)"
  ECO2 = 0,
  //% block="Luftschadstoffe (TVOC, ppb)"
  TVOC = 1,
}

//% color=#204830 icon="\uf0c0" block="MintKöpfchen" groups='["Sensoren", "Farben & LEDs", "GeekServos"]'
namespace MintKoepfchen {
  let ccs811WarmedUp = false;

  //% blockId="set_color_eyes"
  //% block="Augen leuchten in $color"
  //% color.defl=NeoPixelColors.Red
  //% group="Farben & LEDs"
  export function setzeAugenfarbe(color: NeoPixelColors): void {
    const leds = robotbit.rgb();

    leds.setPixelColor(0, neopixel.colors(color));
    leds.setPixelColor(1, neopixel.colors(color));
    leds.show();
  }

  //% blockId="set_color_feeler"
  //% block="Fühler leuchten in $color"
  //% color.defl=NeoPixelColors.Red
  //% group="Farben & LEDs"
  export function setzeFuehlerfarbe(color: NeoPixelColors): void {
    const leds = robotbit.rgb();

    leds.setPixelColor(2, neopixel.colors(color));
    leds.setPixelColor(3, neopixel.colors(color));
    leds.show();
  }

  /**
   * Misst die Bodenfeuchtigkeit in Prozent.
   * @param pin analoger Pin, an den der Sensor angeschlossen ist, z. B. AnalogPin.P0
  */
  //% blockId="measure_soil_moisture"
  //% block="Bodenfeuchtigkeit an $pin messen (\\%)"
  //% pin.defl=AnalogPin.P0
  //% group="Sensoren"
  export function missBodenfeuchtigkeit(pin: AnalogPin): number {
    const value = pins.analogReadPin(pin);
    return mapValue(value, 218, 300, 0, 100);
  }

  /**
   * Misst die Entfernung mit einem Ultraschallsensor.
   * @param trigPin Pin, der mit TRIG verbunden ist, z. B. DigitalPin.P1
   * @param echoPin Pin, der mit ECHO verbunden ist, z. B. DigitalPin.P2
  */
  //% blockId="measure_ultrasonic_distance"
  //% block="Abstand mit Ultraschall messen (cm) TRIG $trigPin ECHO $echoPin"
  //% trigPin.defl=DigitalPin.P1
  //% echoPin.defl=DigitalPin.P2
  //% group="Sensoren"
  export function missAbstand(
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
   * Wärmt den CCS811 beim ersten Aufruf zwei Minuten lang auf und gibt danach
   * entweder eCO2 in ppm oder TVOC in ppb zurück. Gibt bei einem Fehler -1 zurück.
  */
  //% blockId="measure_ccs811_air_quality"
  //% block="Luftqualität mit CCS811 messen: $measurement"
  //% measurement.defl=CCS811Measurement.ECO2
  //% group="Sensoren"
  export function missLuftqualitaet(measurement: CCS811Measurement): number {
    if (!ccs811WarmedUp) {
      const sensorFound = CCS811.starteSensor(CCS811Address.Address0x5A);

      if (!sensorFound) {
        serial.writeLine('CCS811 nicht gefunden');
        serial.writeValue('Hardware-ID', CCS811.liesHardwareID());
        return -1;
      }

      serial.writeLine('CCS811-Aufwärmphase gestartet');
      basic.pause(120000);
      ccs811WarmedUp = true;
      serial.writeLine('CCS811-Aufwärmphase beendet');
    }

    // Normalerweise steht jede Sekunde ein neuer Messwert bereit. Die Zeitbegrenzung
    // verhindert, dass das Programm bei getrenntem Sensor dauerhaft blockiert.
    const timeoutAt = input.runningTime() + 5000;
    while (!CCS811.liesNeueDaten()) {
      if (CCS811.letzterFehlercode() != 0) {
        serial.writeValue('CCS811 Fehler', CCS811.letzterFehlercode());
        return -1;
      }

      if (input.runningTime() >= timeoutAt) {
        serial.writeLine('CCS811-Zeitüberschreitung');
        return -1;
      }

      basic.pause(100);
    }

    if (measurement == CCS811Measurement.TVOC) {
      return CCS811.letzterTVOCWert();
    }

    return CCS811.letzterECO2Wert();
  }

  /**
   * Misst die Wassertemperatur am angegebenen Pin in Grad Celsius.
   * @param pinNumber Pin, an den die Datenleitung des Sensors angeschlossen ist, z. B. 1
   */
  //% blockId=dstemp block="Wassertemperatur an $pin messen (°C)"
  //% group="Sensoren" weight=99
  export function missWassertemperatur(pin: DigitalPin): number {
    return ModulePlus.Temperature(pin) / 10;
  }

  /**
   * Liest den digitalen Rohwert des Linienfolgers aus.
   * Der Block gibt abhängig vom Sensor und Untergrund 0 oder 1 zurück.
   * @param pin digitaler Pin, an den der Sensor angeschlossen ist, z. B. DigitalPin.P1
   */
  //% block="Wert vom Linienfolger an $pin lesen (0 oder 1)"
  //% pin.defl=DigitalPin.P1
  //% group="Sensoren"
  export function liesLinienfolgerWert(pin: DigitalPin): number {
    pins.setPull(pin, PinPullMode.PullUp);
    return pins.digitalReadPin(pin);
  }
}
