curl \
-X POST \
-d @./data/create.json \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/users/signup" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
