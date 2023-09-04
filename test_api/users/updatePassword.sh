curl \
-X PATCH \
-d @./data/newPassword.json \
-H "Authorization: bearer $(cat ../config/TOKEN.txt)" \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/users/updatePassword/" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty 
