curl \
-X GET \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/productCategories/$(cat ../config/ID.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
