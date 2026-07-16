# Mintköpfchen-Robotik

MakeCode-Erweiterung für Sensoren, LEDs, Servos und Robotik.

## Blöcke

Alle Blöcke befinden sich im Namespace **MintKöpfchen** und sind in folgende
Unterkategorien gegliedert:

- **Sensoren**: Bodenfeuchtigkeit, Ultraschall-Entfernung, CCS811-Luftqualität,
  DS18B20-Wassertemperatur und digitaler Linienfolger-Wert
- **Farben & LEDs**: Farben der Augen und Fühler einstellen
- **GeekServos**: reservierter Bereich für zukünftige GeekServo-Blöcke

Der Linienfolger-Block gibt den digitalen Rohwert `0` oder `1` zurück. Ob der
jeweilige Wert eine schwarze Linie bedeutet, hängt vom verwendeten Sensor und
seiner Einstellung ab und muss im Programm ausgewertet werden.

## DS18B20

Die Datenleitung des Sensors braucht einen Pull-up-Widerstand. Dieser wird
zwischen der Datenleitung und 3,3 V angeschlossen. Es wird ein 4,7-kΩ-Widerstand
benötigt; auch ein 5-kΩ-Widerstand funktioniert. Wenn man zwei 10-kΩ-Widerstände
parallel schaltet, erhält man ebenfalls 5 kΩ. Dazu werden beide Widerstände mit
ihren Enden jeweils an dieselben zwei Anschlusspunkte angeschlossen.

Folgende Verkabelung wird benötigt:

- 3,3 V des micro:bit mit 3,3 V des Sensors und dem ersten Widerstandsbein verbinden
- Datenleitung des micro:bit mit der Datenleitung des Sensors und dem zweiten Widerstandsbein verbinden
- die GND-Anschlüsse miteinander verbinden

<img src="docs/verkabelungDS18B20.jpeg">

Bei einer Messung über ModulePlus muss das Ergebnis durch 10 geteilt werden,
um die Temperatur in °C zu erhalten. Der Block dieser Erweiterung übernimmt
diese Umrechnung bereits.
