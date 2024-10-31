
# Liste des différentes requêtes API

## POST - Création d'une Campagne

- **URL** : <http://localhost:3000/api/campaigns>
- **Méthode** : POST
- **Description** : Crée une nouvelle campagne avec les informations fournies, y compris les arbres associés et la localisation.

### Corps de la requête (JSON)

```json
{
  "name": "Nouvelle Campagne de Reforestation",
  "description": "Description de la nouvelle campagne.",
  "start_campaign": "2025-01-01T00:00:00Z",
  "end_campaign": "2025-12-31T23:59:59Z",
  "treesCampaign": [
    { "id": 1 },
    { "id": 3 },
    { "id": 5 }
  ],
  "location": {
    "name_location": "Forêt Tropicale",
    "id_country": 4
  }
}
```

### Réponse en cas de succès (JSON)

```json
{
  "message": "Campagne créée avec succès",
  "campaign": {
    "id": 2,
    "name": "Nouvelle Campagne de Reforestation",
    "description": "Description de la nouvelle campagne.",
    "start_campaign": "2025-01-01T00:00:00.000Z",
    "end_campaign": "2025-12-31T23:59:59.000Z",
    "created_at": "2024-10-30T18:00:00.000Z",
    "updated_at": "2024-10-30T18:00:00.000Z",
    "id_location": 2,
    "treesCampaign": [
      {
        "id": 1,
        "name": "Eucalyptus Hybride",
        "price_ht": "15.50",
        "quantity": 500,
        "age": 2,
        "created_at": "2024-10-30T12:00:00.000Z",
        "updated_at": "2024-10-30T12:00:00.000Z",
        "id_species": 1
      }
    ],
    "location": {
      "id": 2,
      "name_location": "Forêt Tropicale",
      "id_country": 4,
      "country": {
        "id": 4,
        "name": "Pérou"
      }
    }
  }
}
```

## PATCH - Mise à jour d'une Campagne

- **URL** : <http://localhost:3000/api/campaigns/{id}>
- **Méthode** : PATCH
- **Description** : Met à jour les informations d'une campagne existante, y compris les arbres associés et la localisation.

### Corps de la requête (JSON)

```json
{
  "id": 1,
  "name": "Campagne Mise à Jour",
  "treesCampaign": [
    { "id": 2 },
    { "id": 4 }
  ],
  "location": {
    "id": 3,
    "name_location": "Nouvelle Forêt",
    "id_country": 5
  }
}
```

### Réponse en cas de succès (JSON)

```json
{
  "message": "Campagne mise à jour avec succès",
  "campaign": {
    "id": 1,
    "name": "Campagne Mise à Jour",
    "description": "Projet de replantation d’arbres en Amazonie",
    "start_campaign": "2023-12-31T23:00:00.000Z",
    "end_campaign": "2024-12-31T23:00:00.000Z",
    "id_location": 3,
    "treesCampaign": [
      {
        "id": 2,
        "name": "Chêne Rouge",
        "price_ht": "20.00",
        "quantity": 200,
        "age": 5,
        "id_species": 2
      }
    ],
    "location": {
      "id": 3,
      "name_location": "Nouvelle Forêt",
      "id_country": 5,
      "country": {
        "id": 5,
        "name": "Brésil"
      }
    }
  }
}
```

## GET - Récupération d'une Campagne

- **URL** : <http://localhost:3000/api/campaigns/{id}>
- **Méthode** : GET
- **Description** : Récupère les détails d'une campagne spécifique, y compris les arbres associés et la localisation.

### Réponse en cas de succès (JSON)

```json
{
  "id": 1,
  "name": "Campagne Mise à Jour",
  "description": "Projet de replantation d’arbres en Amazonie",
  "start_campaign": "2023-12-31T23:00:00.000Z",
  "end_campaign": "2024-12-31T23:00:00.000Z",
  "id_location": 3,
  "treesCampaign": [
    {
      "id": 2,
      "name": "Chêne Rouge",
      "price_ht": "20.00",
      "quantity": 200,
      "age": 5,
      "id_species": 2
    }
  ],
  "location": {
    "id": 3,
    "name_location": "Nouvelle Forêt",
    "id_country": 5,
    "country": {
      "id": 5,
      "name": "Brésil"
    }
  }
}
```

## DELETE - Suppression d'une Campagne

- **URL** : <http://localhost:3000/api/campaigns/{id}>
- **Méthode** : DELETE
- **Description** : Supprime une campagne existante.

### Réponse en cas de succès (JSON)

```json
{
  "message": "Campagne supprimée avec succès"
}
```
