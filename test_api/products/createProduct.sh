curl \
-X POST \
-d @./data/create.json \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/products" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
