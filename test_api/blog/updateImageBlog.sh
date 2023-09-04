curl \
-X PUT \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-F "image=@../../e-commerce-data/images/creatorbackground-7.jpg" \
-H "Content-Type: multipart/form-data" "$(cat ../config/URL.txt)/api/v1/blog/uploadImageBlog/$(cat ../config/ID.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty
