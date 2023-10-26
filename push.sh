
git add .
echo "Inserisci un messaggio di commit:"
read commit_message

git commit -m "$commit_message"

git push https://github.com/dupine/ServerDeepDark.git

echo "Push completato!"
