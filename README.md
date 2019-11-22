# keyforge-compendium-updater

This code is intended to be used with my replacement project for the keyforge-compendium website. It grabs 25 decks in 15 second intervals from the keyforgegame api. Along with the decks is a list of all cards in the decks, ignoring duplicates. The code then sorts these cards into a card list, ignoring cards already in the list, mavericks and legacy/anomaly cards. Once all the cards for a set have been found, the interval is ended and the cards are sent to my firebase database.

If you wish to use this with your own firebase project, run npm install and then go to your project on firebase -> settings -> service accounts. Make sure you have 'Firebase Admin SDK' set to NodeJS and then click 'Generate new private key'. Place this key in the same folder as App.js and rename it to 'serviceAccountKey.json'.

The code runs one expansion at a time, with the assumption that after the initial setup, this code only needs to be run when a new set is released. At the top of the file is a 'USER CONTROLS' comment. Just change the expansion to match the expansion you wish the add to your database.

When a new set comes out, find a deck on https://www.keyforgegames.com/deck-details/<DECK_ID> and go to https://www.keyforgegame.com/api/decks/<DECK_ID>. In this JSON file will be an 'expansion' key with a number. CotA is 341, AoA is 435 and WC is 452. In App.js, go to the expansions constant on line 19 and add a new key for the new set pointed to an object containing the code for the new set and the count of cards (usually posted on reddit). Then run the code.
