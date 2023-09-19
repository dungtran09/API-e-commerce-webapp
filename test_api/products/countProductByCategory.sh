curl \
-X GET \
-d @./data/query.json \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/products/count?category=Laptop" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
