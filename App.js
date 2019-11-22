//packages required
const admin = require("firebase-admin");
const http = require("https");

//USER CONTROLS
const currentExpansion = "wc";

//set up firebase admin rights and database connection
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://keyforge-compendium.firebaseio.com",
});

const db = admin.firestore();

//card grabber from keyforge website
const expansions = {
	cota: { code: 341, count: 370 },
	aoa: { code: 435, count: 370 },
	wc: { code: 452, count: 405 },
};
const cardList = {};
const defaultUrl = "https://www.keyforgegame.com/api/decks/";
let currentPage = 0;

const timer = setInterval(() => {
	currentPage++;
	http.get(
		defaultUrl +
			"?page=" +
			currentPage +
			"&page_size=25&search=&expansion=" +
			expansions[currentExpansion].code +
			"&links=cards",
		res => {
			console.log("");
			console.log("attempt #" + currentPage);
			//sets encoding and then combines packets to single string
			res.setEncoding("utf8");
			var body = "";
			res.on("data", res => {
				body += res;
			});

			//converts string to an object and then adds the new cards to the list
			res.on("end", () => {
				const newCards = JSON.parse(body)["_linked"]["cards"];
				newCards.forEach(card => {
					if (
						!cardList[card["id"]] &&
						!card["is_maverick"] &&
						card["expansion"] === expansions[currentExpansion].code
					) {
						cardList[card["id"]] = card;
					}
				});
				console.log(
					Object.keys(cardList).length +
						" / " +
						expansions[currentExpansion].count
				);
			});
		}
	);
	if (Object.keys(cardList).length === expansions[currentExpansion].count) {
		clearInterval(timer);
		saveToDB();
	}
}, 15000);

//save cards to DB
function saveToDB() {
	db.collection("cards")
		.doc(currentExpansion)
		.set(cardList);
}
