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
  "examtype": "editor",  // editor, math, eduvidual, gforms, website, microsoft365
  "delfolderonexit": false,  // ordner der clients beim beenden des abgesicherten modus löschen (am client)
  "spellchecklang": "de-DE",  // en-GB, de-DE, fr-FR, es-ES, it-IT, none
  "suggestions": false,   // soll language tool vorschläge für verbesserungen zeigen
  "moodleTestId": null,   // aus der angegebenen moodle domain wird die test id automatisch herausgeschnitten
  "moodleDomain": "eduvidual.at",  // domain der moodle instanz
  "moodleURL": null,  // vollständige moodle test url
  "cmargin": {    // angaben für den korrekturrand bei der pdf erstellung im editor
    "side": "right",
    "size": 3    // cm 
  },
  "gformsTestId": null,   // id des google forms formulares
  "screenshotinterval": 0,  // in welchem intervall sollen die screenshots der clients aktualisiert werden (overhead beachten)
  "msOfficeFile": false,  // welche datei (am onedrive der lehrperson) soll den clients zum editieren zur verfügung gestellt werden
  "screenslocked": false, // sind die client screens abgesperrt (abgedunkelt)
  "pin": "1337", // exam pin
  "linespacing": "2",  // zeilenabstand im finalen pdf das aus dem editor generiert wird
  "unlockonexit": false, //  unused !!
  "requireBiP": false,  // müssen die clients am bip authentifizieren damit sie zur teacher instanz verbinden können?
  "groups": false,   // sollen die clients in 2 gruppen A / B aufgeteilt werden
  "groupA": [   // gruppeneinteilung A
    "Thomas"    // client name
  ],
  "groupB": [],  
  "languagetool": false,    // rechtschreibüberprüfung mit languagetool ja /nein
  "fontfamily": "sans-serif",  // serife schriftart im editor oden non-serif ?
  "audioRepeat": "0", // wie oft dürfen die teilnehmenden eine audio datei abspielen 0 - unlimited
  "screenshotocr": false   // soll als zusätzliche sicherheit im screenshot der clients nach dem exam pin gesucht werden
}
```
#### Konfigurationparameter mit BiP
```javascript


```
