## teacher 
# teacher api (serverroutes)

<todo>
    meldet sich ein client mit PIN an muss dieser überprüft werden und bei korrektem pin in eine lokale ClientList gelegt werden.. 
</todo>

# multicastserver (broadcasting)

broadcastet exam object {name, timestamp} an alle


# teacher webfrontend

formular um exam name zu wählen... startet über #teacher api den #multicastserver  (sollte exam name vom formular übertragen :-) )

(möglicherweise wäre es gut bei den broadcasts nachzusehen ob der exam name nicht schon im netz gebroadcastet wurde und vom localen #multicastclient bereits notiert)


=================================================================
=================================================================

## student
# client api (clientroutes)


# multicastclient (listening)
startet automatisch... jede exam instanz ist automatsch auch "listening" für andere broadcasts...

hört auf die broadcasts der multicastserver und trägt empfangene infos von exam instanzen in seine    examServerList[]   ein..

# student webfrontend
fragt über die #client api ab ob der #multicastclient schon eine exam instanz gefunden hat und zeigt sie als button an

<todo>
    auf klick sollte dann ein PIN abgefragt werden und dieser pin mit client name und client ID an die gewählte exam instanz #teacherapi gesandt werden
</todo>

über die #teacherapi kann dann beim teacher der pin geprüft und der client bei korrektem pin in eine clientList aufgenommen werden... (ip, id, port)

dadurch kann man dann über die client ip die ensprechende #clientapi ansprechen und zb. den start von "startexam.sh"  triggern.. oder die abgabe

