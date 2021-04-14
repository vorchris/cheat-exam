# webfrontend generell
Bootsrtap Framework
Sass

template engine ETA
[ETA](https://github.com/eta-dev/eta)


# teacher
### server api (serverroutes)
meldet sich ein client mit PIN an muss dieser überprüft werden und bei korrektem pin in eine lokale ClientList gelegt werden..

    teacherinstanz sollte eine crfs token für den client erstellen und bei korrektem PIN dem client zurücksenden und dieses muss vorraussetzung sein für die verarbeitung an der #client api (sonst kann ja jeder xbeliebige call von irgendeinem webbrowser im netz den client in den exam mode schicken zb. oder sperren)

bei der server api sollten wir aufpassen dass sie nicht missbraucht werden kann.. (siehe crfs token bei der client api)  - zu diesem zeitpunkt aber denke ich, dass zb. die route /start/  ja durchaus von überall her offen sein sollte.. dies würde es ermöglichen das ganze node programm am schulserver laufen zu lassen und jeder lehrer connected einfach von irgendeinem webbrowser aus (dadurch würde das teacher programm plattformübergreifend funktionieren)

### multicastserver (broadcasting)

broadcastet exam object {name, timestamp} an alle


### teacher webfrontend

formular um exam name zu wählen... startet über #teacher api den #multicastserver  (sollte exam name vom formular übertragen :-) )

(möglicherweise wäre es gut bei den broadcasts nachzusehen ob der exam name nicht schon im netz gebroadcastet wurde und vom localen #multicastclient bereits notiert)





# student
### client api (clientroutes)
wartet auf befehle vom #teacherUI (api calls) um zb. zu speichern, oder in den exam mode zu wechseln, oder einen screenshot zu machen

die #client api darf keinen api call annehmen bevor der client sich nicht am server registriert hat und sein crfs token erhalten und gespeichert hat.. die #client api muss bei jedem request zuerst das übermittelte crfs token überprüfen 

### multicastclient (listening)
startet automatisch... jede exam instanz ist automatsch auch "listening" für andere broadcasts...

hört auf die broadcasts der multicastserver und trägt empfangene infos von exam instanzen in seine    examServerList[]   ein..

### student webfrontend
fragt über die #client api ab ob der #multicastclient schon eine exam instanz gefunden hat und zeigt sie als button an

auf klick sollte dann ein PIN abgefragt werden und dieser pin mit client name und client ID an die gewählte exam instanz #teacherapi gesandt werden


über die #teacherapi kann dann beim teacher der pin geprüft und der client bei korrektem pin in eine clientList aufgenommen werden... (ip, id, port)

dadurch kann man dann über die client ip die ensprechende #clientapi ansprechen und zb. den start von "startexam.sh"  triggern.. oder die abgabe

[child_process_execfile documentation](https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback)
