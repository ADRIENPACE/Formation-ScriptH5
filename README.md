# H5Script SDK

Projet **Infor M3** pour la création de scripts H5 permettant d’interagir avec les écrans de l’ERP **M3 Infor**.

Les scripts H5 s’exécutent côté client dans l’interface M3 et permettent d’étendre ou d’automatiser le comportement des écrans (listes, formulaires, dialogues, etc.).

> **Important** — On développe **uniquement sur les fichiers `.ts`** (TypeScript). On ne modifie les fichiers `.js` (JavaScript) **que lorsqu’on n’a pas les sources TypeScript** (fichiers livrés ou hérités sans `.ts`).

---

## Documentation

La documentation détaillée du SDK, du fonctionnement des scripts H5 et de la connexion à l’ERP M3 est disponible dans :

- **[Documentation/H5ScriptDevelopersGuide.pdf](Documentation/H5ScriptDevelopersGuide.pdf)** — Guide développeur H5 Script (fonctionnement du projet, connexion à M3, API, bonnes pratiques).

---

## Bibliothèques et typings

Le projet s’appuie sur les définitions TypeScript suivantes (dans `Samples/Samples/typings/` et dans le template) pour interagir avec les écrans M3 :

| Fichier | Rôle |
|--------|------|
| **h5.script.d.ts** | API H5 Script : éléments d’écran (boutons, listes, grilles, champs), `ContentElement`, `ListView`, `ConfirmDialog`, etc. |
| **infor.controls.d.ts** | Contrôles Infor (accordéon, menu contextuel, DataGrid, listes, indicateurs de chargement, etc.) via jQuery. |
| **jquery.d.ts** | Définitions TypeScript pour jQuery (manipulation DOM, AJAX). |
| **jquery.json.d.ts** | Extension jQuery pour la sérialisation JSON. |
| **es6-promise.d.ts** | Définitions pour les Promises (ES6) utilisées dans les appels asynchrones. |

Ces typings permettent l’autocomplétion et la vérification de types lors du développement de scripts H5 en TypeScript.

---

## Structure du projet

```
H5ScriptSDK_10.4.1_20251022/
├── Documentation/
│   ├── H5ScriptDevelopersGuide.pdf   # Guide développeur (à consulter en priorité)
│   └── CHANGELOG.txt                 # Historique des modifications du SDK
├── Samples/                          # Dossier de travail principal
│   ├── InstallWebServer.cmd         # Installation du serveur web (une fois)
│   ├── StartWebServer.cmd           # Démarrage du serveur web (à chaque utilisation)
│   ├── Nodejs/                       # Serveur Node.js (connect + serve-static)
│   │   └── webserver.js
│   └── Samples/                      # Exemples de scripts H5 (TypeScript → JavaScript)
│       ├── typings/                  # Définitions TypeScript (libs ci-dessus)
│       ├── H5SampleHelloWorld.ts     # Exemple de base (dialogue, arguments)
│       ├── H5SampleAddElements.ts    # Ajout d’éléments (date picker, radio, etc.)
│       ├── H5SampleMIService.ts      # Appels MI Service
│       ├── H5SampleIonApiService.ts  # Appels ION API
│       └── ...                       # Autres exemples (grilles, export Excel, etc.)
├── Templates/
│   └── H5ScriptsProjectTemplate/     # Modèle de projet pour créer de nouveaux scripts H5
└── README.md
```

---

## Serveur web (Samples)

Le travail du projet se fait dans **Samples**. Deux scripts permettent d’installer et de lancer le serveur web local :

| Script | Rôle |
|--------|------|
| **InstallWebServer.cmd** | Installe le serveur web (dépendances Node.js : `connect`, `serve-static`). À exécuter **une seule fois** après clonage ou première utilisation. |
| **StartWebServer.cmd** | Démarre le serveur web sur le port 8080 et sert le dossier `Samples`. À lancer **à chaque utilisation** du projet. |

**Utilisation :**

1. Depuis la racine du projet, aller dans `Samples` et exécuter **InstallWebServer.cmd** (une fois).
2. À chaque session de travail, exécuter **StartWebServer.cmd** pour lancer le serveur (fenêtre « Web Server » sur le port 8080, répertoire `../Samples`).
3. Laisser la fenêtre ouverte tant que vous travaillez ; fermer pour arrêter le serveur.

---

## Démarrage

1. **Lire le guide**  
   Ouvrir [Documentation/H5ScriptDevelopersGuide.pdf](Documentation/H5ScriptDevelopersGuide.pdf) pour comprendre le cycle de vie des scripts, la connexion à M3 et l’utilisation de l’API.

2. **Installer et lancer le serveur web**  
   Dans `Samples`, exécuter une fois **InstallWebServer.cmd**, puis à chaque utilisation **StartWebServer.cmd**.

3. **S’inspirer des exemples**  
   Les scripts dans `Samples/Samples/` (`.ts` compilés en `.js`) montrent des cas d’usage : dialogues, listes, grilles, MI Service, ION API, etc.

4. **Compiler**  
   Lancer la compilation TypeScript (cible ES5, source maps) en mode watch : **Ctrl+Shift+P** → **Tasks: Run Task** → **tsc:watch - tsconfig.json**.  
   Sous **Cursor** comme sous **VSCode**, la tâche **tsc:watch - tsconfig.json** recompile automatiquement le `.ts` en `.js` à chaque sauvegarde ; le JavaScript généré est celui exécuté dans M3.

---

## Exemple minimal (Hello World)

```typescript
class H5SampleHelloWorld {
    public static Init(args: IScriptArgs): void {
        const message = args.elem
            ? "Connected element: " + args.elem.Name
            : "No element connected.";
        ConfirmDialog.Show({
            header: "H5SampleHelloWorld",
            message: message,
            dialogType: "Information"
        });
    }
}
```

Le point d’entrée standard d’un script H5 est la méthode statique `Init(args: IScriptArgs)`, appelée par M3 avec l’élément connecté et les arguments du script.

---

## Versions et historique

- **SDK** : H5Script SDK 10.4.1 (2025-10-22).  
- **Changelog** : [Documentation/CHANGELOG.txt](Documentation/CHANGELOG.txt).
