curl \
-X GET \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/products/monthly-plan/$(cat ../config/QUERY.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty

