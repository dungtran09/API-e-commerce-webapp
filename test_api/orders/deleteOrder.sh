curl \
-X DELETE \
-H "Authorization: bearer $(cat ../products/config/token.txt)" \
-H "Content-Type: application/json" "$(cat ./config/URL.txt)/api/v1/orders/$(cat ./config/ID.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
