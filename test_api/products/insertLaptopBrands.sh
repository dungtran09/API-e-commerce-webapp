curl \
-X POST \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/insert/insertLaptopBrands" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
