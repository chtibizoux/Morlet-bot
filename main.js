const fs = require("fs");
const cheerio = require('cheerio');
const request = require('request');
const discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const algebra = require('algebra.js');

const bot = new discord.Client();
if (!fs.existsSync("config.json")) {
    console.error("Please create config.json file config.json.exemple is an exemple");
}
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const fontSize = 14;
const pixelByLine = 30;
var functions = {};
var functionsToGraph = [];
var graphX = 0;
var graphY = 0;
var zoom = 1;
var activeMessage = null;

var insultes = ["Va marcher sur des Légos", "Gredin", "Sac à puces", "Banane", "Saucisse", "fdp", "Cornichon", "Espèce d'épinard", "Fils de mouette", "Capitaine de bateau-lavoir", "Cornichon", "Paltoquet", "Philistin", "Terrine", "Foutriquet", "Scélérat", "Mauviette", "Malotru", "Goujat", "Vil faquin", "Maraud", "Désembouteillé des alpages", "Crétin des Alpes", "Protozoaire", "Ectoplasme", "Cloporte", "Coprophage", "abruti", "va chier dans sa caisse", "aller niquer sa mère", "va te faire enculer", "va te faire endauffer", "va te faire foutre", "va te faire mettre", "andouille", "anglo-fou", "appareilleuse", "assimilé", "assimilée", "astèque", "avorton", "bachi-bouzouk", "baleine", "bande d’abrutis", "baraki", "bâtard", "baudet", "beauf", "bellicole", "bête", "bête à pleurer ", "bête comme ses pieds ", "bête comme un chou ", "bête comme un cochon ", "biatch ", "bibi ", "bic ", "bicot ", "bicotte ", "bite ", "bitembois ", "Bitembois ", "bordille ", "boucaque ", "boudin ", "bouffi ", "bouffon ", "bouffonne ", "bougnoul ", "bougnoule ", "Bougnoulie ", "bougnoulisation ", "bougnouliser ", "bougre ", "boukak ", "boulet ", "bounioul ", "bounioule ", "bourdille ", "bourrer ", "bourricot ", "branleur ", "bridé ", "bridée ", "brigand ", "brise-burnes ", "bulot ", "cacou ", "cafre ", "cageot ", "caldoche ", "carcavel ", "casse-bonbon ", "casse-couille ", "casse-couilles ", "cave ", "chagasse ", "chaoui ", "charlot de vogue ", "charogne ", "chauffard ", "chbeb ", "cheveux bleus ", "chien de chrétien ", "chiennasse ", "chienne ", "chier ", "chieur ", "chinetoc ", "chinetoque ", "Chinetoque ", "chintok ", "chleuh ", "chnoque ", "citrouille ", "coche ", "colon ", "complotiste ", "con ", "con comme la lune ", "con comme ses pieds ", "con comme un balai ", "con comme un manche ", "con comme une chaise ", "con comme une valise ", "con comme une valise à poignée intérieure ", "con comme une valise sans poignée ", "conasse ", "conchier ", "connard ", "connarde ", "connasse ", "conspirationniste ", "couille molle ", "counifle ", "courtaud ", "CPF ", "crétin ", "crevure ", "cricri ", "crotté ", "crouillat ", "crouille ", "croûton ", "dago ", "débile ", "débougnouliser ", "doryphore ", "doxosophe ", "doxosophie ", "drouille ", "du schnoc ", "ducon ", "duconnot ", "dugenoux ", "dugland ", "duschnock ", "emmanché ", "emmerder ", "emmerdeur ", "emmerdeuse ", "empafé ", "empaffé ", "empapaouté ", "enculé ", "enculé de ta race ", "enculer ", "enfant de garce ", "enfant de putain ", "enfant de pute ", "enfant de salaud ", "enflure ", "enfoiré ", "envaselineur ", "envoyer faire foutre ", "épais ", "espèce de ", "espingoin ", "espingouin ", "étron ", "face de chien ", "face de craie ", "face de pet ", "face de rat ", "fachiste ", "FDP ", "fell ", "fermer sa gueule ", "fils de bâtard ", "fils de chien ", "fils de chienne ", "fils de garce ", "fils de pute ", "fils de ta race ", "fiotte ", "folle ", "fouteur ", "fripouille ", "frisé ", "fritz ", "Fritz ", "fumelard ", "fumier ", "garage à bite ", "garage à bites ", "garce ", "gaupe ", "GDM ", "gestapette ", "Gestapette ", "gland ", "glandeur ", "glandeuse ", "glandouillou ", "glandu ", "glandue ", "gnoul ", "gnoule ", "Godon ", "gogol ", "gogolito ", "goï ", "gook ", "gouer ", "gouilland ", "gouine ", "goulou-goulou ", "gourdasse ", "gourde ", "gourgandine ", "grognasse ", "gueniche ", "guide de merde ", "guindoule ", "gwer ", "habitant ", "halouf ", "imbécile ", "incapable ", "islamo-gauchisme ", "islamo-gauchiste ", "islamogauchiste ", "jean-foutre ", "jean-fesse ", "jeannette ", "journalope ", "juivaillon ", "karlouche ", "kawish ", "khel ", "Khmer rouge ", "Khmer vert ", "kikoo ", "kikou ", "Kraut ", "la fermer ", "lâche ", "lâcheux ", "lavette ", "loche ", "lopette ", "macaroni ", "magot ", "makoumé ", "mal blanchi ", "mange-merde ", "mangeux de marde ", "marchandot ", "margouilliste ", "marsouin ", "mauviette ", "maya ", "melon ", "mercon ", "merdaille ", "merdaillon ", "merde ", "merdeux ", "merdouillard ", "michto ", "minable ", "minus ", "misérable ", "moinaille ", "moins-que-rien ", "mollusque ", "monacaille ", "mongol ", "mongol à batteries ", "moricaud ", "mort aux vaches ", "morue ", "moule à gaufres ", "moule à merde ", "mouloud ", "muzz ", "naze ", "nazi ", "nèg ", "négraille ", "nègre ", "nègre d’Océanie ", "négresse ", "négrillon ", "négrillonne ", "négro ", "nez de bœuf ", "niac ", "niafou ", "niaiseux ", "niakoué ", "nique sa mère ", "nique ta mère ", "niquer ", "niquer sa mère ", "niquer sa reum ", "niquez votre mère ", "nodocéphale ", "nœud ", "noob ", "nord-phocéen ", "NTM ", "nul ", "nulle ", "orchidoclaste ", "ordure ", "ortho ", "pakos ", "panoufle ", "patarin ", "PD ", "peau ", "peau de couille ", "peau de fesse ", "peau de vache ", "pecque ", "pédale ", "pédé ", "pédoque ", "pelle à merde ", "péquenaud ", "personnage de comédie ", "petite bite ", "petite merde ", "pignouf ", "pignoufe ", "pisser à la raie ", "pissou ", "pithécanthrope ", "pleutre ", "plouc ", "pochard ", "pompe à vélo ", "porc ", "porcas ", "porcasse ", "pouf ", "pouffiasse ", "poufiasse ", "poulet ", "pourriture ", "punaise ", "putain ", "putain de ta race ", "pute ", "pute borgne ", "putois ", "raclure ", "raclure de bidet ", "radoteur ", "rat ", "raté ", "raton ", "résidu de capote ", "retourne aux asperges ", "ripopée ", "robespierrot ", "roi des cons ", "roi nègre ", "rosbif ", "roulure ", "sac à foutre ", "sac à merde ", "sac à papier ", "sagouin ", "sagouine ", "salaud ", "sale ", "salop ", "salope ", "sans-couilles ", "satrouille ", "sauvage ", "schbeb ", "schlague ", "schleu ", "Schleu", "Schleue", "schnock", "schnoque", "sent-la-pisse", "sidi", "social-traître", "sorcière", "sottiseux", "sous-merde", "stéarique", "ta bouche", "ta gueule", "ta mère", "ta mère la pute", "ta race", "ta yeule", "tache", "tafiole", "tantouserie", "tantouze", "tapette", "tapettitude", "tarlouze", "tata", "tchoutche", "tebé", "tête carrée", "tête de boche", "tête de cochon", "tête de con", "tête de gland", "tête de linotte", "tête de mort", "tête de mule", "tête de nœud", "tête de veau", "téteux", "teubé", "Thénardier", "thon", "tocard", "traînée", "travail d’Arabe", "travailler comme un nègre", "triple buse", "trou de cul", "trou du cul", "trouduc", "truiasse", "truie", "va te faire foutre", "va te faire une soupe d’esques", "vaurien", "vaurienne", "vendu", "vert-de-gris", "vide-couilles", "viédase", "vier", "vieux", "vieux blanc", "vipère lubrique", "weeaboo", "xéropineur", "Y'a bon", "youd", "youp", "youpin", "youpine", "youpinisation", "youpiniser", "youtre", "zguègue"];

var insulteInterval;

var trainings = JSON.parse(fs.readFileSync("./trainings.json", "utf8"));
var helps = JSON.parse(fs.readFileSync("./helps.json", "utf8"));

bot.on('ready', () => {
    console.log("This Bot is online!");
    bot.user.setActivity("type )help");
});

bot.on("message", (message) => {
    if (message.content.startsWith(")")) {
        if (message.content.startsWith(")help")) {
            message.channel.send("`)calculator` Aide de la calculatrice\n`)aide MonProblème` Affiche une aide\n`)training MonExo` Affiche un Exercice de maths\n`)table f 0 10 1` Affiche le tableau de la fonction `f(x)` avec x de 0 à 10 et un pas de 1\n`)graph f g` Trace le graphique des fonctions `f` et `g`\n`)functions` Affiche toutes les fonctions");
        }else if (message.content.startsWith(")calculator")) {
            message.channel.send("__**Opérations Basiques:**__\n`+`: Additionner\n`-`: Soustraire\n`/`: Diviser\n`*`: Multiplier\n`**`: Puissance\n`()`: Les Parenthèses marchent");
            message.channel.send("__**Trigonométrie:**__\n`cosd()`: Retourne le cosinus d'un nombre.(Degrées)\n`acosd()`: Retourne l'arc cosinus d'un nombre.(Degrées)\n`sind()`: Retourne le sinus d'un nombre.(Degrées)\n`asind()`: Retourne l'arc sinus d'un nombre.(Degrées)\n`tand()`: Retourne la tangente d'un nombre.(Degrées)\n`atand()`: Retourne l'arc tangente d'un nombre.(Degrées)\n`cos(x)`: Retourne le cosinus d'un nombre.(Radians)\n`acos(x)`: Retourne l'arc cosinus d'un nombre.(Radians)\n`cosh(x)`: Renvoie le cosinus hyperbolique d'un nombre.(Radians)\n`acosh(x)`: Retourne l'arc cosinus hyperbolique d'un nombre.(Radians)\n`sin(x)`: Retourne le sinus d'un nombre.(Radians)\n`asin(x)`: Retourne l'arc sinus d'un nombre.(Radians)\n`sinh(x)`: Retourne le sinus hyperbolique d'un nombre.(Radians)\n`asinh(x)`: Retourne l'arc sinus hyperbolique d'un nombre.(Radians)\n`tan(x)`: Retourne la tangente d'un nombre.(Radians)\n`atan(x)`: Retourne l'arc tangente d'un nombre.(Radians)\n`tanh(x)`: Retourne la tangente hyperbolique d'un nombre(Radians)\n`atanh(x)`: Retourne l'arc tangente hyperbolique d'un nombre.(Radians)");
            message.channel.send("__**Nombres:**__\n`E`: Nombre d'Euler, la base des logarithmes naturels, environ 2,718.\n`LN2`: Logarithme naturel de 2, environ 0,693.\n`LN10`: Logarithme naturel de 10, environ 2,302.\n`LOG2E`: Logarithme de base 2 de E, environ 1,442.\n`LOG10E`: Logarithme de base 10 de E, environ 0,434.\n`PI`: Quotient de la circonférence d'un cercle par son diamètre, environ 3,14159.\n`SQRT1_2`: Racine carrée de 1/2 ; équivalent de 1 sur la racine carrée de 2, environ 0,707.\n`SQRT2`: Racine carrée de 2, environ 1,414.");
            message.channel.send("__**Fonctions:**__\n`abs(x)`: Retourne la valeur absolue d'un nombre.\n`cbrt(x)`: Renvoie la racine cubique d'un nombre.\n`ceil(x)`: Retourne le plus petit entier supérieur ou égal à la valeur passée en paramètre.\n`clz32(x)`: Renvoie le nombre de zéros qui préfixent un entier sur 32 bits.\n`exp(x)`: Renvoie l'exponentielle d'un nombre (soit Enombre) avec E la constante d'Euler (2,718...).\n`expm1(x)`: Renvoie le résultat de 1 moins l'exponentielle d'un nombre.\n`floor(x)`: Retourne le plus grand entier inférieur ou égal à la valeur passée en paramètre.\n`fround(x)`: Renvoie le nombre flottant exprimé sur 32 bits le plus proche de l'argument.\n`log(x)`: Retourne le logarithme naturel (loge) d'un nombre.\n`log1p(x)`: Retourne le logarithme naturel de 1 + un nombre.\n`log10(x)`: Retourne le logarithme en base 10 d'un nombre.\n`log2(x)`: Retourne le logarithme en base 2 d'un nombre.\n`random()`: Retourne un nombre pseudo-aléatoire compris entre 0 (inclus) et 1 (exclu).\n`round(x)`: Retourne l'arrondi d'un nombre.\n`sign(x)`: Retourne le signe d'un nombre, indiquant s'il est positif, négatif ou égal à zéro.\n`sqrt(x)`: Retourne la racine carrée d'un nombre.\n`trunc(x)`: Retourne la partie entière d'un nombre (la partie décimale est retirée).\n`factorial()`: factoriser Ex: `factorial(4) = 1*2*3*4`");
        }else if (message.content.startsWith(")aide ")) {
            aide(message);
        }else if (message.content.startsWith(")training ")) {
            training(message);
        }else if (message.content.startsWith(")table ")) {
            table(message);
        }else if (message.content.startsWith(")graph ")) {
            graphX = 0;
            y = 0;
            zoom = 1;
            functionsToGraph = message.content.slice(7).split(" ");
            message.react("⬅️");
            message.react("➡️");
            message.react("⬆️");
            message.react("⬇️");
            message.react("➕");
            message.react("➖");
            graph(message, 0, 0, 0);
        }else if (message.content.startsWith(")functions")) {
            fun(message);
        }else if (message.content.startsWith(")bougeard ")) {
            bougeard(message);
        }else if (message.content.startsWith(")insulte")) {
            message.channel.send("tape `)stop` pour arrêter ce massacre");
            insulteInterval = setInterval(function () {
                message.channel.send(insultes[Math.floor(Math.random() * insultes.length)]);
            }, 5000);
        }else if (message.content.startsWith(")stop")) {
            clearInterval(insulteInterval);
        }else {
            message.channel.send("tape `)help`");
        }
    }else {
        if (message.author.id !== bot.user.id) {
            calculator(message);
        }
    }
});

function aide(message) {
    var search = message.content.slice(6).split(" ").join("+");
    for(var i = 0; i < helps.length; i++) {
        if (helps[i].Name === search.toLowerCase()) {
            message.channel.send(trainings[i].Content);
            return;
        }
    }
    var options = {
        url: "https://www.google.com/search?q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
    request(options, function(error, response, responseBody) {
        if (error) return;
        var urls = [];
        $ = cheerio.load(responseBody);
        $( "a" ).each(function() {
            if ($(this).attr("href").includes("cours")) {
                if (!$(this).attr("href").startsWith("http")) {
                    if ($(this).attr("href").startsWith("/")) {
                        urls.push("https://www.google.com" + $(this).attr("href"));
                    }else {
                        urls.push("https://www.google.com/search/" + $(this).attr("href"));
                    }
                }else {
                    urls.push($(this).attr("href"));
                }
            }
        });
        message.channel.send(urls[0]);
    });
}

function training(message) {
    var search = message.content.slice(10).split(" ").join("+");
    for(var i = 0; i < trainings.length; i++) {
        if (trainings[i].Name === search.toLowerCase()) {
            message.channel.send(trainings[i].Content);
            return;
        }
    }
    var options = {
        url: "https://www.google.com/search?q=Exercice+" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
    request(options, function(error, response, responseBody) {
        if (error) return;
        var urls = [];
        $ = cheerio.load(responseBody);
        $( "a" ).each(function() {
            if ($(this).attr("href").includes("exercice")) {
                if (!$(this).attr("href").startsWith("http")) {
                    if ($(this).attr("href").startsWith("/")) {
                        urls.push("https://www.google.com" + $(this).attr("href"));
                    }else {
                        urls.push("https://www.google.com/search/" + $(this).attr("href"));
                    }
                }else {
                    urls.push($(this).attr("href"));
                }
            }
        });
        message.channel.send(urls[0]);
    });
}

var cosd = (degrees) => Math.cos(degrees * Math.PI / 180);
var acosd = (degrees) => Math.acos(degrees * Math.PI / 180);
var sind = (degrees) => Math.sin(degrees * Math.PI / 180);
var asind = (degrees) => Math.asin(degrees * Math.PI / 180);
var tand = (degrees) => Math.tan(degrees * Math.PI / 180);
var atand = (degrees) => Math.atan(degrees * Math.PI / 180);
var atand = (degrees) => Math.atan(degrees * Math.PI / 180);
var factorial = (number) => {
    if (number === 0) return 0;
    if (Number.isInteger(number)) {
        var finalnumber = 1;
        for (var i = 0; i < number; i++) {
            finalnumber *= i + 1;
        }
        return finalnumber;
    }
};

function graph(message, rectionX = 0, rectionY = 0, rectionZoom = 0) {
    graphX += rectionX * pixelByLine;
    graphY += rectionY * pixelByLine;
    zoom += rectionZoom;
    var canvas = createCanvas(960, 540);
    var ctx = canvas.getContext('2d');
    var lineHeight = canvas.height / pixelByLine;
    var lineWidth = canvas.width / pixelByLine;
    var graduationsLineWidth = 8;
    ctx.font = fontSize + 'px Arial';
    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // grid
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;
    for (var i = lineHeight/2; i <= lineHeight; i++) {
        ctx.beginPath();
        ctx.lineTo(0, i * pixelByLine);
        ctx.lineTo(canvas.width, i * pixelByLine);
        ctx.stroke();
    }
    for (var i = lineHeight/2; i >= 0; i--) {
        ctx.beginPath();
        ctx.lineTo(0, i * pixelByLine);
        ctx.lineTo(canvas.width, i * pixelByLine);
        ctx.stroke();
    }
    for (var i = lineWidth/2; i <= lineWidth; i++) {
        ctx.beginPath();
        ctx.lineTo(i * pixelByLine, 0);
        ctx.lineTo(i * pixelByLine, canvas.height);
        ctx.stroke();
    }
    for (var i = lineWidth/2; i >= 0; i--) {
        ctx.beginPath();
        ctx.lineTo(i * pixelByLine, 0);
        ctx.lineTo(i * pixelByLine, canvas.height);
        ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    if ((canvas.width / 2) - graphX > 0 && (canvas.width / 2) - graphX < canvas.width) {
        ctx.beginPath();
        ctx.lineTo((canvas.width / 2) - graphX, 0);
        ctx.lineTo((canvas.width / 2) - graphX, canvas.height);
        ctx.stroke();
    }
    if ((canvas.height / 2) - graphY > 0 && (canvas.height / 2) - graphY < canvas.height) {
        ctx.beginPath();
        ctx.lineTo(0, (canvas.height / 2) - graphY);
        ctx.lineTo(canvas.width, (canvas.height / 2) - graphY);
        ctx.stroke();
    }
    // Graduations
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right";
    if ((canvas.width / 2) - graphX > 0 && (canvas.width / 2) - graphX < canvas.width) {
        for (var i = lineHeight/2; i <= lineHeight; i++) {
            ctx.beginPath();
            ctx.lineTo((canvas.width / 2) - graphX, i * pixelByLine);
            ctx.lineTo((canvas.width / 2) - graphX - graduationsLineWidth, i * pixelByLine);
            ctx.stroke();
            ctx.fillText(-((i - (lineHeight/2)) + (graphY / pixelByLine)) * zoom, (canvas.width / 2) - graphX - 2, i * pixelByLine + 16);
        }
        for (var i = lineHeight/2; i >= 0; i--) {
            ctx.beginPath();
            ctx.lineTo((canvas.width / 2) - graphX, i * pixelByLine);
            ctx.lineTo((canvas.width / 2) - graphX - graduationsLineWidth, i * pixelByLine);
            ctx.stroke();
            ctx.fillText(-((i - (lineHeight/2)) + (graphY / pixelByLine)) * zoom, (canvas.width / 2) - graphX - 2, i * pixelByLine + 16);
        }
    }else {
        if ((canvas.width / 2) - x > 0) {
            for (var i = lineHeight/2; i <= lineHeight; i++) {
                ctx.beginPath();
                ctx.lineTo(canvas.width, i * pixelByLine);
                ctx.lineTo(canvas.width - graduationsLineWidth, i * pixelByLine);
                ctx.stroke();
                ctx.fillText(-((i - (lineHeight/2)) + (graphY / pixelByLine)) * zoom, canvas.width - 2, i * pixelByLine + 16);
            }
            for (var i = lineHeight/2; i >= 0; i--) {
                ctx.beginPath();
                ctx.lineTo(canvas.width, i * pixelByLine);
                ctx.lineTo(canvas.width - graduationsLineWidth, i * pixelByLine);
                ctx.stroke();
                ctx.fillText(-((i - (lineHeight/2)) + (graphY / pixelByLine)) * zoom, canvas.width - 2, i * pixelByLine + 16);
            }
        }else if ((canvas.width / 2) - graphX < canvas.width) {
            ctx.textAlign = "left";
            for (var i = lineHeight/2; i <= lineHeight; i++) {
                ctx.beginPath();
                ctx.lineTo(0, i * pixelByLine);
                ctx.lineTo(graduationsLineWidth, i * pixelByLine);
                ctx.stroke();
                ctx.fillText(-((i - (lineHeight/2)) + (graphY / pixelByLine)) * zoom, 2, i * pixelByLine + 16);
            }
            for (var i = lineHeight/2; i >= 0; i--) {
                ctx.beginPath();
                ctx.lineTo(0, i * pixelByLine);
                ctx.lineTo(graduationsLineWidth, i * pixelByLine);
                ctx.stroke();
                ctx.fillText(-((i - (lineHeight/2)) + (graphY / pixelByLine)) * zoom, 2, i * pixelByLine + 16);
            }
        }
    }
    ctx.textAlign = "right";
    if ((canvas.height / 2) - graphY > 0 && (canvas.height / 2) - graphY < canvas.height) {
        for (var i = lineWidth/2; i <= lineWidth; i++) {
            ctx.beginPath();
            ctx.lineTo(i * pixelByLine, (canvas.height / 2) - graphY);
            ctx.lineTo(i * pixelByLine, (canvas.height / 2) - graphY + graduationsLineWidth);
            ctx.stroke();
            ctx.fillText(((i - (lineWidth/2)) + (graphX / pixelByLine)) * zoom, i * pixelByLine - 2, (canvas.height / 2) - graphY + 16);
        }
        for (var i = lineWidth/2; i >= 0; i--) {
            ctx.beginPath();
            ctx.lineTo(i * pixelByLine, (canvas.height / 2) - graphY);
            ctx.lineTo(i * pixelByLine, (canvas.height / 2) - graphY + graduationsLineWidth);
            ctx.stroke();
            ctx.fillText(((i - (lineWidth/2)) + (graphX / pixelByLine)) * zoom, i * pixelByLine - 2, (canvas.height / 2) - graphY + 16);
        }
    }else {
        if ((canvas.width / 2) - graphX > 0) {
            for (var i = lineWidth/2; i <= lineWidth; i++) {
                ctx.beginPath();
                ctx.lineTo(i * pixelByLine, canvas.height);
                ctx.lineTo(i * pixelByLine, canvas.height - graduationsLineWidth);
                ctx.stroke();
                ctx.fillText(((i - (lineWidth/2)) + (graphX / pixelByLine)) * zoom, i * pixelByLine - 2, canvas.height - 16);
            }
            for (var i = lineWidth/2; i >= 0; i--) {
                ctx.beginPath();
                ctx.lineTo(i * pixelByLine, canvas.height);
                ctx.lineTo(i * pixelByLine, canvas.height - graduationsLineWidth);
                ctx.stroke();
                ctx.fillText(((i - (lineWidth/2)) + (graphX / pixelByLine)) * zoom, i * pixelByLine - 2, canvas.height - 16);
            }
        }else if ((canvas.width / 2) - graphX < canvas.width) {
            ctx.textAlign = "left";
            for (var i = lineWidth/2; i <= lineWidth; i++) {
                ctx.beginPath();
                ctx.lineTo(i * pixelByLine, 0);
                ctx.lineTo(i * pixelByLine, graduationsLineWidth);
                ctx.stroke();
                ctx.fillText(((i - (lineWidth/2)) + (graphX / pixelByLine)) * zoom, i * pixelByLine - 2, 16);
            }
            for (var i = lineWidth/2; i >= 0; i--) {
                ctx.beginPath();
                ctx.lineTo(i * pixelByLine, 0);
                ctx.lineTo(i * pixelByLine, graduationsLineWidth);
                ctx.stroke();
                ctx.fillText(((i - (lineWidth/2)) + (graphX / pixelByLine)) * zoom, i * pixelByLine - 2, 16);
            }
        }
    }
    // Functions
    for (var i = 0; i < functionsToGraph.length; i++) {
        if (typeof functions[functionsToGraph[i]] !== "undefined") {
            //Choose a color
            ctx.strokeStyle = colorByLetter(functionsToGraph[i]);
            ctx.lineWidth = 4;
            ctx.beginPath();
            for (var z = canvas.width/2; z <= canvas.width; z++) {
                var result = eval(functions[functionsToGraph[i]].split("x").join("(" + (z - (canvas.width/2)) / pixelByLine + ")"));
                ctx.lineTo((z - (canvas.width/2)) * zoom + (canvas.width/2) - graphX, (-result * pixelByLine) * zoom + (canvas.height/2) - graphY);
            }
            ctx.stroke();
            ctx.beginPath();
            for (var z = canvas.width/2; z >= 0; z--) {
                var result = eval(functions[functionsToGraph[i]].split("x").join("(" + (z - (canvas.width/2)) / pixelByLine + ")"));
                ctx.lineTo((z - (canvas.width/2)) * zoom + (canvas.width/2) - graphX, (-result * pixelByLine) * zoom + (canvas.height/2) - graphY);
            }
            ctx.stroke();
        }
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./Images/graph.png', buffer);
    message.channel.send("", {files: ["./Images/graph.png"]}).then((sent) => {
        if (activeMessage !== null) {
            activeMessage.delete();
        }
        activeMessage = sent;
    });
}
function colorByLetter(letter) {
    switch (letter) {
        case "a":
            return "#00ffff";
            break;
        case "b":
            return "#ff00ff";
            break;
        case "c":
            return "#ffff00";
            break;
        case "d":
            return "#00ff99";
            break;
        case "e":
            return "#99ff00";
            break;
        case "f":
            return "#0000ff";
            break;
        case "g":
            return "#ff0000";
            break;
        case "h":
            return "#00ff00";
            break;
        case "i":
            return "#009900";
            break;
        case "j":
            return "#990000";
            break;
        case "k":
            return "#000099";
            break;
        case "l":
            return "#ff9900";
            break;
        case "m":
            return "#ff0099";
            break;
        case "n":
            return "#9900ff";
            break;
        case "o":
            return "#0099ff";
            break;
        case "p":
            return "#9999ff";
            break;
        case "q":
            return "#99ff99";
            break;
        case "r":
            return "#ff9999";
            break;
        case "s":
            return "#009999";
            break;
        case "t":
            return "#990099";
            break;
        case "u":
            return "#999900";
            break;
        case "v":
            return "#ffcc99";
            break;
        case "w":
            return "#00ffcc";
            break;
        case "x":
            return "#009900";
            break;
        case "y":
            return "#99ffcc";
            break;
        case "z":
            return "#ff99cc";
            break;
        default:
            return "#ff0000";
    }
}

function fun(message) {
    if (Object.keys(functions).length > 0) {
        var messageToSend = "__**Fonctions:**__\n```";
        for (var key in functions) {
            messageToSend += "\n" + key + "(x)=" + functions[key];
        }
        messageToSend += "\n```";
        message.channel.send(messageToSend);
    }else {
        message.channel.send("Il n'y a pas encore de fonction définie");
    }
}

function table(message) {
    var all = message.content.slice(7).split(" ");
    var mathFunction = all[0];
    var start = parseInt(all[1]);
    var end = parseInt(all[2]);
    var pas = parseInt(all[3]);
    var messageToSend = "";
    if (functions[mathFunction] && !isNaN(start) && !isNaN(end) && !isNaN(pas)) {
        for (var i = start; i <= end; i++) {
            try {
                with (Math){
                    "use strict";
                    var result = eval(functions[mathFunction].split("x").join("(" + i + ")"));
                    if (result === Infinity) {
                        result = "L'infinit: ∞";
                    }else if (result === -Infinity) {
                        result = "Moins l'infinit: -∞";
                    }else if (result === false) {
                        result = "Faux";
                    }else if (result === true) {
                        result = "Vrai";
                    }
                    messageToSend += i + " : " + result + "\n";
                }
            } catch (e) {}
        }
        if (messageToSend !== "") {
            message.channel.send(messageToSend.slice(0, messageToSend.length - 2));
        }
    }
}
function calculator(message) {
    var goodMessage = message.content.split(" ").join("").split(",").join(".").split("=").join("==").split(")(").join(")*(");
    // easter eggs
    var easterEggsMessage = goodMessage.toLowerCase();
    if (easterEggsMessage.includes("0+0")) {
        message.channel.send(":thinking:mmmmmmmmmmmhhhh:thinking:", {files: ["./Images/Tête_à_Toto.png"]});
    }if (easterEggsMessage.includes("la vie")) {
        message.channel.send("42");
    }else {
        // Calculator
        if (goodMessage !== "" && !goodMessage.includes("console") && !goodMessage.includes("bot") && !goodMessage.includes("config") && !goodMessage.includes("message") && !goodMessage.includes("discord") && !goodMessage.includes("cheerio") && !goodMessage.includes("fs") && !goodMessage.includes("request")) {
            try {
                with (Math){
                    "use strict";
                    var result = eval(goodMessage);
                    if (result === Infinity) {
                        result = "L'infinit: ∞";
                    }else if (result === -Infinity) {
                        result = "Moins l'infinit: -∞";
                    }else if (result === false) {
                        result = "Faux";
                    }else if (result === true) {
                        result = "Vrai";
                    }
                    message.channel.send(result);
                }
            } catch (e) {}
            // Fonctions
            if ((/^[a-z]\([a-z]\)\=\=/).test(goodMessage)) {
                var mathFunction = goodMessage.slice(0, 1);
                var letter = goodMessage.slice(2, goodMessage.indexOf(")=="));
                var splitedMessage = goodMessage.slice(goodMessage.indexOf(")==") + 3).split(letter);
                for (var i = 0; i < splitedMessage.length - 1; i++) {
                    if ((/[0-9]/).test(splitedMessage[i].slice(-1))) {
                        splitedMessage[i] += "*";
                    }
                }
                for (var i = 1; i < splitedMessage.length; i++) {
                    if (splitedMessage[i].slice(0, 1) === "(") {
                        splitedMessage[i] = "*" + splitedMessage[i];
                    }
                }
                functions[mathFunction] = splitedMessage.join("x");
                try {
                    with (Math){
                        "use strict";
                        var result = eval(functions[mathFunction].split("x").join("0"));
                        message.react("✅");
                    }
                } catch (e) {}
            }else if ((/^[a-z]\([+-]?[0-9]?[.]?[0-9]+\)$/).test(goodMessage)) {
                var mathFunction = goodMessage.slice(0, 1);
                var number = goodMessage.slice(2, goodMessage.indexOf(")"));
                try {
                    with (Math){
                        "use strict";
                        var result = eval(functions[mathFunction].split("x").join("(" + number + ")"));
                        if (result === Infinity) {
                            result = "L'infinit: ∞";
                        }else if (result === -Infinity) {
                            result = "Moins l'infinit: -∞";
                        }else if (result === false) {
                            result = "Faux";
                        }else if (result === true) {
                            result = "Vrai";
                        }
                        message.channel.send(result);
                    }
                } catch (e) {}
            }else {
                // Equations
                if (goodMessage.includes("==")) {
                    try {
                        // Extract all letters
                        var letters = goodMessage.replace(/[0-9=+-\/()*]/g, "").split("");
                        for (var i = 0; i < letters.length; i++) {
                            if (letters.includes(letters[i], (i + 1))) {
                                letters.splice(i, 1);
                            }
                        }
                        // Replace 4x by 4 * x and 4(x + 2) by 4 * (x + 2)
                        for (var y = 0; y < letters.length; y++) {
                            var splitedMessage = goodMessage.split("**").join("^").split("==").join("=").split(letters[y]);
                            for (var i = 0; i < splitedMessage.length - 1; i++) {
                                if ((/[0-9]/).test(splitedMessage[i].slice(-1))) {
                                    splitedMessage[i] += "*";
                                }
                            }
                            for (var i = 1; i < splitedMessage.length; i++) {
                                if (splitedMessage[i].slice(0, 1) === "(") {
                                    splitedMessage[i] = "*" + splitedMessage[i];
                                }
                            }
                            goodMessage = splitedMessage.join(letters[y]);
                        }
                        var eq = algebra.parse(goodMessage);
                        if (letters.length > 0) {
                            var messageToSend = "__**Solutions:**__\n```";
                            for (var i = 0; i < letters.length; i++) {
                                var answer = eq.solveFor(letters[i]);
                                if (answer.toString() !== "") {
                                    if (answer.toString().includes(",")) {
                                        var answers = answer.toString().split(",");
                                        for (var y = 0; y < answers.length; y++) {
                                            messageToSend += letters[i] + (y + 1) + " = " + answers[y] + "\n";
                                        }
                                    }else {
                                        messageToSend += letters[i] + " = " + answer.toString() + "\n";
                                    }
                                }else {
                                    messageToSend += "Il n'y a pas de solution pour" + letters[i];
                                }
                            }
                            messageToSend += "\n```";
                            message.channel.send(messageToSend);
                        }
                    } catch (e) {}
                }
            }
        }
    }
}

bot.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.author.id !== bot.user.id) {
        if (user.id != bot.user.id) {
            if (reaction.emoji.name === "⬅️") {
                graph(reaction.message, -1, 0, 0);
            }else if (reaction.emoji.name === "➡️") {
                graph(reaction.message, 1, 0, 0);
            }else if (reaction.emoji.name === "⬆️") {
                graph(reaction.message, 0, -1, 0);
            }else if (reaction.emoji.name === "⬇️") {
                graph(reaction.message, 0, 1, 0);
            }else if (reaction.emoji.name === "➕") {
                graph(reaction.message, 0, 0, 1);
            }else if (reaction.emoji.name === "➖") {
                graph(reaction.message, 0, 0, -1);
            }
        }
    }
});

bot.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.author.id !== bot.user.id) {
        if (user.id != bot.user.id) {
            if (reaction.emoji.name === "⬅️") {
                graph(reaction.message, -1, 0, 0);
            }else if (reaction.emoji.name === "➡️") {
                graph(reaction.message, 1, 0, 0);
            }else if (reaction.emoji.name === "⬆️") {
                graph(reaction.message, 0, -1, 0);
            }else if (reaction.emoji.name === "⬇️") {
                graph(reaction.message, 0, 1, 0);
            }else if (reaction.emoji.name === "➕") {
                graph(reaction.message, 0, 0, 1);
            }else if (reaction.emoji.name === "➖") {
                graph(reaction.message, 0, 0, -1);
            }
        }
    }
});

bot.login(config.token);
