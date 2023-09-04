curl \
-X POST \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-d @./data/create.json \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/productCategories" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
