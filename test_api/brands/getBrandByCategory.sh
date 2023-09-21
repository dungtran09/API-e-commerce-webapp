curl \
-X GET \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/brands?$(cat ../config/QUERY.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
