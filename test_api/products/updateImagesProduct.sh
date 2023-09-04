curl \
-X PUT \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-F "images=@../../e-commerce-data/images/creatorbackground-7.jpg" \
-F "images=@../../e-commerce-data/images/collection.png" \
-H "Content-Type: multipart/form-data" "$(cat ../config/URL.txt)/api/v1/products/uploadImagesProduct/$(cat ../config/ID.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
