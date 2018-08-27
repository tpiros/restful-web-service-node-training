ls -1 *.json | sed 's/.json$//' | while read col; do 
    ~/Documents/development/mongo-tools/bin/mongoimport --host localhost --port 32768 --db star-wars --collection characters --file $col.json
done
