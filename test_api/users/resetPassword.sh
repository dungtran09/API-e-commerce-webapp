curl \
-X PATCH \
-d @./data/newPassword.json \
-H "Content-Type: application/json" "$(cat ../config/URL.txt)/api/v1/users/resetPassword/$(cat ../config/RESET_PASSWORD_TOKEN.txt)" \
-o ./data/log.json && cat ./data/log.json | underscore print --outfmt pretty 
