# UVC Herkansing Backend

Deze repository bevat het backend gedeelte van het UVC Herkansing project. De frontend voor dit project kan worden gevonden op [UVC Hugo Frontend](https://github.com/HugovandeVelde/UVC-Hugo-frontend).

## Aan de slag

Om deze backend lokaal uit te voeren, volg deze stappen:

1. Zorg ervoor dat Docker actief is op je systeem.
2. Voer eenvoudigweg `docker compose up` uit om de backend te starten.

Nu zou de backend van het UVC Herkansing project actief moeten zijn.

---

## Documentatie:

Ik heb de oude code onder de folder OldService als 1 grote microservice gemaakt, aan de werking van deze code is niets veranderd.

Ik heb een nieuwe microservice gemaakt genaamd RatingService, in de folder RatingService. Alle code voor de herkansing staat hierin.

Ook heb ik `apigateway.js` gemaakt, deze staat in de root folder van het project.