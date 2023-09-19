curl \
-X GET \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/products/colors" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
