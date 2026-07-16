/**
 * Manueller Hardwaretest für die Erweiterung.
 *
 * Taste A: nächsten Test auswählen
 * Taste B: ausgewählten Test starten
 *
 * Die Nummer des ausgewählten Tests wird auf dem micro:bit angezeigt.
 * Messwerte werden zusätzlich mit einer Beschriftung über die serielle
 * Schnittstelle ausgegeben.
 *
 * 1 = Augen-LEDs
 * 2 = Fühler-LEDs
 * 3 = Bodenfeuchtigkeit an P0
 * 4 = Ultraschallsensor mit TRIG an P1 und ECHO an P2
 * 5 = Wassertemperatur an P1
 * 6 = Linienfolger an P1
 * 7 = CCS811-Luftqualität (beim ersten Start zwei Minuten Wartezeit)
 *
 * Da mehrere Tests dieselben Pins verwenden, sollte immer nur der Sensor
 * angeschlossen sein, der gerade getestet wird.
 */

let ausgewaehlterTest = 1;

function zeigeWert(name: string, wert: number): void {
  serial.writeValue(name, wert);
  basic.showNumber(wert);
}

function testeAugen(): void {
  MintKoepfchen.setzeAugenfarbe(NeoPixelColors.Red);
  basic.pause(500);
  MintKoepfchen.setzeAugenfarbe(NeoPixelColors.Green);
  basic.pause(500);
  MintKoepfchen.setzeAugenfarbe(NeoPixelColors.Blue);
  basic.pause(500);
  MintKoepfchen.setzeAugenfarbe(NeoPixelColors.Black);
  basic.showIcon(IconNames.Yes);
}

function testeFuehler(): void {
  MintKoepfchen.setzeFuehlerfarbe(NeoPixelColors.Red);
  basic.pause(500);
  MintKoepfchen.setzeFuehlerfarbe(NeoPixelColors.Green);
  basic.pause(500);
  MintKoepfchen.setzeFuehlerfarbe(NeoPixelColors.Blue);
  basic.pause(500);
  MintKoepfchen.setzeFuehlerfarbe(NeoPixelColors.Black);
  basic.showIcon(IconNames.Yes);
}

function testeBodenfeuchtigkeit(): void {
  const wert = MintKoepfchen.missBodenfeuchtigkeit(AnalogPin.P0);
  zeigeWert('Bodenfeuchtigkeit %', wert);
}

function testeAbstand(): void {
  const wert = MintKoepfchen.missAbstand(DigitalPin.P1, DigitalPin.P2);
  zeigeWert('Abstand cm', wert);
}

function testeWassertemperatur(): void {
  const wert = MintKoepfchen.missWassertemperatur(DigitalPin.P1);
  zeigeWert('Wassertemperatur C', wert);
}

function testeLinienfolger(): void {
  const wert = MintKoepfchen.liesLinienfolgerWert(DigitalPin.P1);
  zeigeWert('Linienfolger', wert);
}

function testeLuftqualitaet(): void {
  basic.showIcon(IconNames.Asleep);
  serial.writeLine(
    'CCS811-Test gestartet. Beim ersten Start zwei Minuten warten.',
  );

  const eco2 = MintKoepfchen.missLuftqualitaet(CCS811Measurement.ECO2);
  const tvoc = MintKoepfchen.missLuftqualitaet(CCS811Measurement.TVOC);

  serial.writeValue('eCO2 ppm', eco2);
  serial.writeValue('TVOC ppb', tvoc);

  if (eco2 < 0 || tvoc < 0) {
    basic.showIcon(IconNames.No);
  } else {
    basic.showIcon(IconNames.Yes);
  }
}

function starteAusgewaehltenTest(): void {
  basic.clearScreen();

  if (ausgewaehlterTest == 1) {
    testeAugen();
  } else if (ausgewaehlterTest == 2) {
    testeFuehler();
  } else if (ausgewaehlterTest == 3) {
    testeBodenfeuchtigkeit();
  } else if (ausgewaehlterTest == 4) {
    testeAbstand();
  } else if (ausgewaehlterTest == 5) {
    testeWassertemperatur();
  } else if (ausgewaehlterTest == 6) {
    testeLinienfolger();
  } else {
    testeLuftqualitaet();
  }
}

input.onButtonPressed(Button.A, () => {
  ausgewaehlterTest += 1;

  if (ausgewaehlterTest > 7) {
    ausgewaehlterTest = 1;
  }

  basic.showNumber(ausgewaehlterTest);
});

input.onButtonPressed(Button.B, () => {
  starteAusgewaehltenTest();
});

serial.writeLine('Mintköpfchen-Robotik-Hardwaretest bereit');
basic.showNumber(ausgewaehlterTest);
