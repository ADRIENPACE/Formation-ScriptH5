/**
 * Classe d'exercice de formation pour H5ScriptSDK
 * Cette classe démontre l'utilisation des services MI (M3 Interface) 
 * pour récupérer des informations sur un article
 */
class FormationExercice {
    // Contrôleur de l'instance courante permettant d'interagir avec l'interface
    private controller: IInstanceController;
    // Service de logging pour enregistrer des messages d'information ou d'erreur
    private log: IScriptLog;
    // Arguments passés au script lors de son initialisation
    private args: string;
    // Service MI pour exécuter des transactions M3
    private miService;

    // Élément de contenu de l'interface utilisateur
    private contentElement: IContentElement;

    /**
     * Constructeur de la classe
     * Initialise toutes les propriétés nécessaires à partir des arguments fournis
     * @param args Arguments du script contenant le contrôleur, le logger, etc.
     */
    constructor(args: IScriptArgs) {
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        // Récupère l'élément de contenu depuis le contrôleur
        this.contentElement = this.controller.GetContentElement();

        // Récupère l'instance courante du service MI
        this.miService = MIService.Current
    }

    /**
     * Méthode statique d'initialisation du script
     * Point d'entrée principal appelé par le framework H5ScriptSDK
     * @param args Arguments du script
     */
    public static Init(args: IScriptArgs): void {
        // Crée une nouvelle instance et exécute la méthode run()
        new FormationExercice(args).run();
    }

    /**
     * Méthode principale d'exécution du script
     * Récupère la valeur d'un champ et interroge le service MI pour obtenir la désignation de l'article
     */
    private run(): void {
        console.log("[RUN] => FormationExercice"); 

        // Récupère le contexte utilisateur (informations sur l'utilisateur connecté)
        const userContext = ScriptUtil.GetUserContext();
        console.log(userContext);
        
        // Exemples de méthodes du contrôleur commentées (pour référence future)
        //console.log(this.controller.GetGrid())
        /*console.log(this.controller.GetInstanceId())
        console.log(this.controller.GetMode())
        console.log(this.controller.GetPanelName())
        console.log(this.controller.GetProgramName())
        console.log(this.controller.GetSortingOrder())
        console.log(this.controller.GetView())
        console.log(this.controller.HideBusyIndicator())*/

        // Exemple d'utilisation de la grille (uniquement disponible sur l'écran B)
        /*const grid:IActiveGrid= this.controller.GetGrid();
        console.log(grid.getData());*/

        // Exemple de modification de valeur de champ (commenté)
        //     ScriptUtil.SetFieldValue("MMITDS", "TOTO");
        
        // Récupère la valeur du champ "WEITNO" (numéro d'article)
        const value = ScriptUtil.GetFieldValue("WEITNO");
   

        // Création d'une requête MI pour interroger M3
        const myRequest = new MIRequest();
        // Programme M3 à appeler (MMS200MI = gestion des articles)
        myRequest.program = "MMS200MI";
        // Transaction à exécuter (GetItmBasic = récupération des informations de base d'un article)
        myRequest.transaction = "GetItmBasic";
        // Champs que la transaction doit retourner (ITDS = désignation de l'article)
        myRequest.outputFields = ["ITDS"];
        // Paramètres d'entrée de la transaction (ITNO = numéro d'article à rechercher)
        myRequest.record = { ITNO: value };

        // Exécution de la requête MI de manière asynchrone
        this.miService.executeRequest(myRequest).then(
            // En cas de succès : affiche la désignation de l'article dans les logs
            (response: IMIResponse) => {
                this.log.Info(`Designation: ${response.item.ITDS}`);
            }).catch(
            // En cas d'erreur : affiche le message d'erreur dans les logs
            (response: IMIResponse) => {
            this.log.Error(response.errorMessage);
        });


    }
}