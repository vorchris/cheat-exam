# Next-Exam Exam-Configurations for BiP
## Motivation
Jede:r Lehrer:in hat in BiP (Bildungsportal) die Möglichkeit seine Prüfungen zu konfigurieren. Dieses Dokument definiert die hierfür notwendigen Schnittstellen.
## Allgemeiner Ablauf aus Usersicht
## Rollen
* Lehrperson
* Teilnehmende
## Ablauf aus Sicht der Lehrperson
### Vorbereitung
Die folgendne Schritte werden im BiP durchgeführt:
1. Login im BiP
2. Erstellen/Bearbeiten einer Prüfung
    * Name der Prüfung
    * Datum und Uhrzeit des Beginns
    * Dauer
    * Auswahl der Teilnehmenden (Klassen oder einzelne Teilnehmende)
    * Prüfungskonfiguration
3. Speichern
### Prüfungsdurchführung
Die Durchführung der Prüfung erfolgt mit dem Next-Exam Teacher Programm.
1. Programm starten
2. Login mit BiP Credentials
3. Liste mit den im BiP vordefinierten Prüfungen wird angezeigt.
    * Die Liste zeigt chronologisch die in der Zukunft liegenden bzw. für die akteulle Zeit geplanten an.
    * In der Vergangenheit liegende Prüfungen können auf Wunsch dargestellt werden.
4. Die Lehrperson wählt die gewünscht Prüfung aus.
5. Prüfung starten
5. Kontrolle der Teilnehmenden
6. Durchführung der Prüfung
## Ablauf aus Sicht der Teilnehmenden
### Vorbereitung
Für dies Rollen nicht notwendig. (solange kein Einschreib- bzw. Anmeldeprozess abgebildet werden soll. Solche Prozesse werden dann im BiP abgebildet.)
### Prüfungsdurchführung
Die Druchführung der Prüfung erfolgt mit dem Next-Exam Student Programm.
1. Programm starten
2. Login mit BiP Credentials
3. Auswahl der Prüfung startet automatisch, sobald die Lehrperson die Prüfung gestartet hat (per Trigger über BiP)
4. Durchführung der Prüfung nachdem die Lehrperson
## Ideen
* Offline Konfig ?
* IP-Adresse des next-exam Teachers auf BiP beim Start der PRüfung hinterlegen (Multicastproblem, Pull-Signal an next-exam Student zum Autostart der Prüfung)
## Definition der Datenstruktur für Prüfungskonfigurationen
### Format
Das generelle Austauschformat ist JSON.
### Konfigurationsparameter
#### Aktuelle Konfigurationsparameter
```javascript
{
  "exammode": true,   // abgesicherter modus für schüler:innen ja/nein
  "examtype": "editor",  // 
  "delfolderonexit": false,
  "spellchecklang": "de-DE",
  "suggestions": false,
  "moodleTestId": null,
  "moodleDomain": "eduvidual.at",
  "moodleURL": null,
  "cmargin": {
    "side": "right",
    "size": 3
  },
  "gformsTestId": null,
  "screenshotinterval": 0,
  "msOfficeFile": false,
  "screenslocked": false,
  "pin": "1337",
  "linespacing": "2",
  "unlockonexit": false,
  "requireBiP": false,
  "groups": false,
  "groupA": [
    "Thomas"
  ],
  "groupB": [],
  "languagetool": false,
  "fontfamily": "sans-serif",
  "audioRepeat": "0",
  "screenshotocr": false
}
```
#### Konfigurationparameter mit BiP
```javascript


```
